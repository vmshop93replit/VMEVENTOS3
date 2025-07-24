import { createClient } from '@supabase/supabase-js';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { eq } from 'drizzle-orm';

// Configuração do Supabase
const SUPABASE_URL = "https://vjjcffkkszsrcvdxxgxy.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqamNmZmtrc3pzcmN2ZHh4Z3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyMDk5MSwiZXhwIjoyMDY4ODk2OTkxfQ.zuToNduxxxZbMumsSo3yfcJczKZEMpa3wVkeYVlBw_A";

// Cliente oficial do Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Pool para session store (usando configuração simulada)
export const pool = new Pool({
  connectionString: `postgresql://postgres:password@localhost:5432/postgres`,
  max: 1,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Configuração completa do DB que mantém compatibilidade com Drizzle
export const db = {
  // Queries para compatibilidade com query.table.method
  query: {
    users: {
      findFirst: async (options: any) => {
        try {
          const whereField = options?.where;
          let query = supabase.from('users').select('*');
          
          if (whereField && whereField.left && whereField.right) {
            const column = whereField.left.name;
            const value = whereField.right;
            query = query.eq(column, value);
            console.log(`🔍 Buscando usuário: ${column} = ${value}`);
          }
          
          const { data, error } = await query.single();
          
          if (error) {
            if (error.code === 'PGRST116') {
              console.log('❌ Usuário não encontrado');
              return null;
            }
            if (error.code === '42P01') {
              console.error('❌ Tabela users não existe.');
              return null;
            }
            console.error('❌ Erro na busca:', error);
            return null;
          }
          
          console.log('✅ Usuário encontrado:', data);
          return data;
        } catch (error) {
          console.error('User findFirst error:', error);
          return null;
        }
      },
      
      findMany: async () => {
        try {
          const { data, error } = await supabase.from('users').select('*');
          if (error) {
            if (error.code === '42P01') {
              console.error('❌ Tabela users não existe.');
              return [];
            }
            throw new Error(error.message);
          }
          return data || [];
        } catch (error) {
          console.error('Users findMany error:', error);
          return [];
        }
      }
    },
    
    contacts: {
      findMany: async () => {
        try {
          const { data, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) {
            if (error.code === '42P01') {
              console.error('❌ Tabela contacts não existe.');
              return [];
            }
            throw new Error(error.message);
          }
          return data || [];
        } catch (error) {
          console.error('Contacts findMany error:', error);
          return [];
        }
      }
    },
    
    page_visits: {
      findMany: async () => {
        try {
          const { data, error } = await supabase
            .from('page_visits')
            .select('*')
            .order('visited_at', { ascending: false });
          if (error) {
            if (error.code === '42P01') {
              console.error('❌ Tabela page_visits não existe.');
              return [];
            }
            throw new Error(error.message);
          }
          return data || [];
        } catch (error) {
          console.error('Page visits findMany error:', error);
          return [];
        }
      }
    }
  },
  
  // Método select para compatibilidade
  select: (fields?: any) => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        limit: async (num: number) => {
          try {
            const tableName = getTableName(table);
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .limit(num);
            if (error) {
              if (error.code === '42P01') {
                console.error(`❌ Tabela ${tableName} não existe.`);
                return [];
              }
              throw new Error(error.message);
            }
            return data || [];
          } catch (error) {
            console.error('Select where limit error:', error);
            return [];
          }
        }
      }),
      orderBy: (order: any) => ({
        execute: async () => {
          try {
            const tableName = getTableName(table);
            const { data, error } = await supabase
              .from(tableName)
              .select('*')
              .order('created_at', { ascending: false });
            if (error) {
              if (error.code === '42P01') {
                console.error(`❌ Tabela ${tableName} não existe.`);
                return [];
              }
              throw new Error(error.message);
            }
            return data || [];
          } catch (error) {
            console.error('Select orderBy error:', error);
            return [];
          }
        }
      }),
      execute: async () => {
        try {
          const tableName = getTableName(table);
          const { data, error } = await supabase
            .from(tableName)
            .select('*');
          if (error) {
            if (error.code === '42P01') {
              console.error(`❌ Tabela ${tableName} não existe.`);
              return [];
            }
            throw new Error(error.message);
          }
          return data || [];
        } catch (error) {
          console.error('Select execute error:', error);
          return [];
        }
      }
    })
  }),
  
  // Método insert
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: () => ({
        execute: async () => {
          try {
            const tableName = getTableName(table);
            const { data: result, error } = await supabase
              .from(tableName)
              .insert(data)
              .select();
            if (error) {
              if (error.code === '42P01') {
                console.error(`❌ Tabela ${tableName} não existe.`);
                return [];
              }
              throw new Error(error.message);
            }
            return result || [];
          } catch (error) {
            console.error('Insert returning execute error:', error);
            return [];
          }
        }
      }),
      execute: async () => {
        try {
          const tableName = getTableName(table);
          const { data: result, error } = await supabase
            .from(tableName)
            .insert(data)
            .select();
          if (error) {
            if (error.code === '42P01') {
              console.error(`❌ Tabela ${tableName} não existe.`);
              return [];
            }
            throw new Error(error.message);
          }
          return result || [];
        } catch (error) {
          console.error('Insert execute error:', error);
          return [];
        }
      }
    })
  }),
  
  // Método delete
  delete: (table: any) => ({
    where: (condition: any) => ({
      returning: () => ({
        execute: async () => {
          try {
            const tableName = getTableName(table);
            const fieldValue = condition.right;
            const { data, error } = await supabase
              .from(tableName)
              .delete()
              .eq('id', fieldValue)
              .select();
            if (error) {
              if (error.code === '42P01') {
                console.error(`❌ Tabela ${tableName} não existe.`);
                return [];
              }
              throw new Error(error.message);
            }
            return data || [];
          } catch (error) {
            console.error('Delete returning execute error:', error);
            return [];
          }
        }
      }),
      execute: async () => {
        try {
          const tableName = getTableName(table);
          const fieldValue = condition.right;
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', fieldValue);
          if (error) {
            if (error.code === '42P01') {
              console.error(`❌ Tabela ${tableName} não existe.`);
              return { rowCount: 0 };
            }
            throw new Error(error.message);
          }
          return { rowCount: 1 };
        } catch (error) {
          console.error('Delete execute error:', error);
          return { rowCount: 0 };
        }
      }
    })
  })
};

// Helper para mapear tabelas
function getTableName(table: any): string {
  if (table === schema.users) return 'users';
  if (table === schema.contacts) return 'contacts';
  if (table === schema.pageVisits) return 'page_visits';
  
  // Se for uma string, retornar diretamente
  if (typeof table === 'string') return table;
  
  throw new Error(`Unknown table: ${table}`);
}