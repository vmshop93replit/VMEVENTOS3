import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando variáveis de ambiente para deploy
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://vjjcffkkszsrcvdxxgxy.supabase.co";
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqamNmZmtrc3pzcmN2ZHh4Z3h5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzMyMDk5MSwiZXhwIjoyMDY4ODk2OTkxfQ.zuToNduxxxZbMumsSo3yfcJczKZEMpa3wVkeYVlBw_A";

// Cliente Supabase para o frontend usando service role
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Funções para interagir com o Supabase diretamente
export const supabaseAPI = {
  // Buscar todos os contatos
  async getContacts() {
    console.log('🔍 Buscando contatos do Supabase...');
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Erro ao buscar contatos:', error);
      return [];
    }
    
    console.log(`✅ ${data?.length || 0} contatos encontrados`);
    return data || [];
  },

  // Buscar usuário para autenticação
  async getUser() {
    // Verificar se existe usuário logado no localStorage
    const user = localStorage.getItem('vm-eventos-user');
    if (!user) {
      console.log('🔍 Nenhum usuário no localStorage');
      throw new Error('Não autenticado');
    }
    
    const userData = JSON.parse(user);
    console.log('✅ Usuário encontrado no localStorage:', userData);
    return userData;
  },

  // Login do usuário
  async login(username: string, password: string) {
    console.log('🔍 Login Supabase - Tentativa:', { username, password: password.slice(0, 3) + '***' });
    
    try {
      // Buscar usuário no Supabase
      console.log('🔍 Buscando usuário no Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        console.log('⚠️ Usuário não encontrado no Supabase, usando fallback');
        // Fallback para credenciais padrão
        const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admvini';
        const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || '939393';
        
        if (username === adminUser && password === adminPass) {
          const user = { id: 1, username: 'admvini' };
          localStorage.setItem('vm-eventos-user', JSON.stringify(user));
          console.log('✅ Fallback: Usuário salvo no localStorage:', user);
          return user;
        }
        throw new Error('Credenciais inválidas');
      }
      
      console.log('✅ Usuário encontrado no Supabase:', { id: data.id, username: data.username });
      
      // Verificar senha usando variáveis de ambiente
      const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admvini';
      const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || '939393';
      
      if (username === adminUser && password === adminPass) {
        const user = { id: data.id, username: data.username };
        localStorage.setItem('vm-eventos-user', JSON.stringify(user));
        console.log('✅ Login bem-sucedido - Usuário salvo no localStorage:', user);
        return user;
      }
      
      console.log('❌ Senha incorreta');
      throw new Error('Credenciais inválidas');
    } catch (error) {
      console.error('❌ Erro completo no login:', error);
      // Último fallback
      const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admvini';
      const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || '939393';
      
      if (username === adminUser && password === adminPass) {
        const user = { id: 1, username: 'admvini' };
        localStorage.setItem('vm-eventos-user', JSON.stringify(user));
        console.log('✅ Fallback final: Usuário salvo no localStorage:', user);
        return user;
      }
      throw error;
    }
  },

  // Logout
  async logout() {
    localStorage.removeItem('vm-eventos-user');
    return { success: true };
  },

  // Deletar contato
  async deleteContact(id: number) {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao deletar contato:', error);
      throw new Error('Falha ao deletar contato');
    }
    
    return { success: true };
  },

  // Buscar estatísticas de visitas
  async getVisitStats() {
    const { data: visits, error } = await supabase
      .from('page_visits')
      .select('*')
      .order('visited_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar visitas:', error);
      return {
        totalVisits: 0,
        visitsByPage: {},
        recentVisits: 0,
        dailyStats: []
      };
    }
    
    const visitsByPageObj = (visits || []).reduce((acc: any, visit: any) => {
      acc[visit.page] = (acc[visit.page] || 0) + 1;
      return acc;
    }, {});
    
    const recentVisits = (visits || []).filter((v: any) => 
      new Date(v.visited_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;
    
    return {
      totalVisits: visits?.length || 0,
      visitsByPage: visitsByPageObj,
      recentVisits,
      dailyStats: []
    };
  },

  // Criar contato (alias para addContact)
  async createContact(contact: any) {
    return this.addContact(contact);
  },

  // Adicionar novo contato
  async addContact(contact: any) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: contact.name,
        phone: contact.phone,
        event_type: contact.eventType, // Note: usando event_type conforme schema
        message: contact.message
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar contato:', error);
      throw new Error('Falha ao adicionar contato');
    }
    
    return data;
  },

  // Criar visita de página (alias para recordPageVisit)
  async createPageVisit(pageData: any) {
    return this.recordPageVisit(pageData);
  },

  // Registrar visita de página
  async recordPageVisit(pageData: any) {
    const { data, error } = await supabase
      .from('page_visits')
      .insert([{
        page: pageData.page,
        ip_address: pageData.ip_address || 'unknown',
        user_agent: pageData.user_agent || navigator.userAgent
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao registrar visita:', error);
      return null;
    }
    
    return data;
  },

  // Buscar todas as visitas
  async getVisits() {
    const { data, error } = await supabase
      .from('page_visits')
      .select('*')
      .order('visited_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar visitas:', error);
      return [];
    }
    
    return data || [];
  }
};