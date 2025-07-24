import { db } from "@db";
import { contacts, pageVisits } from "@shared/schema";
import { InsertContact, InsertPageVisit } from "@shared/schema";
import { desc, sql, count, eq } from "drizzle-orm";

export const storage = {
  async insertContact(contact: InsertContact) {
    try {
      const result = await db.insert(contacts).values(contact).returning().execute();
      return result[0];
    } catch (error) {
      console.error("Error inserting contact:", error);
      throw error;
    }
  },
  
  async getAllContacts() {
    try {
      // Usar o método query do adaptador Supabase
      return await db.query.contacts.findMany();
    } catch (error) {
      console.error("Error getting all contacts:", error);
      throw error;
    }
  },

  async deleteContact(contactId: number) {
    try {
      // Usar Supabase diretamente para deletar
      const { supabase } = await import("../db");
      
      const { data, error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)
        .select()
        .single();

      if (error) {
        console.error("Erro ao deletar contato via Supabase:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  },
  
  // Métodos para gerenciamento de visitas
  async recordPageVisit(pageVisit: InsertPageVisit) {
    try {
      const result = await db.insert(pageVisits).values(pageVisit).returning().execute();
      return result[0];
    } catch (error) {
      console.error("Error recording page visit:", error);
      throw error;
    }
  },
  
  async getAllPageVisits() {
    try {
      return await db.query.page_visits.findMany();
    } catch (error) {
      console.error("Error getting all page visits:", error);
      throw error;
    }
  },
  
  async getPageVisitStats() {
    try {
      // Usar diretamente o Supabase para estatísticas agregadas
      const { supabase } = await import("../db");
      
      // Buscar todas as visitas diretamente do Supabase
      const { data: allVisits, error: visitsError } = await supabase
        .from('page_visits')
        .select('page, visited_at, ip_address')
        .order('visited_at', { ascending: false });

      if (visitsError) {
        console.error('Erro ao buscar visitas:', visitsError);
        return {
          totalVisits: 0,
          visitsByPage: [],
          recentVisits: 0,
          dailyStats: [],
        };
      }

      const visits = allVisits || [];
      
      // Total de visitas
      const totalVisits = visits.length;
      
      // Visitas por página
      const visitsByPage = visits.reduce((acc: any, visit: any) => {
        acc[visit.page] = (acc[visit.page] || 0) + 1;
        return acc;
      }, {});
      
      const visitsByPageResult = Object.entries(visitsByPage).map(([page, count]) => ({
        page,
        count
      }));
      
      // Visitas recentes (últimas 24 horas)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const recentVisits = visits.filter(visit => 
        new Date(visit.visited_at) > oneDayAgo
      ).length;

      // Estatísticas por dia (últimos 7 dias)
      const statsMap: { [key: string]: number } = {};
      
      visits.forEach(visit => {
        const date = new Date(visit.visited_at).toISOString().split('T')[0];
        statsMap[date] = (statsMap[date] || 0) + 1;
      });

      const dailyStats = Object.entries(statsMap)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 7)
        .map(([date, count]) => ({ date, count }));
      
      return {
        totalVisits,
        visitsByPage: visitsByPageResult,
        recentVisits,
        dailyStats,
      };
    } catch (error) {
      console.error("Error getting page visit statistics:", error);
      throw error;
    }
  },
};
