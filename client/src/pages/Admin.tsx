import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Loader2, Calendar, Phone, User, MessageSquare, RefreshCw, 
  LogOut, BarChart2, Clock, Activity, Eye, Trash2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';


// Definição de tipos para os contatos
interface Contact {
  id: number;
  name: string;
  phone: string;
  eventType: string;
  message?: string;
  created_at: string;
}

// Definição de tipos para as visitas
interface PageVisit {
  id: number;
  page: string;
  ip_address?: string;
  user_agent?: string;
  visited_at: string;
}

// Tipos para estatísticas de visitas
interface VisitsByPage {
  page: string;
  count: number;
}

interface DailyStats {
  date: string;
  count: number;
}

interface VisitStats {
  totalVisits: number;
  visitsByPage: VisitsByPage[];
  recentVisits: number;
  dailyStats: DailyStats[];
}

export default function Admin() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingContactId, setDeletingContactId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Consulta à API para obter todos os contatos - usa queryClient configurado
  const { 
    data: contacts, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery<Contact[]>({
    queryKey: ['/api/contacts']
  });
  
  // Consulta para estatísticas de visitas - usa queryClient configurado
  const {
    data: visitStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
    refetch: refetchStats
  } = useQuery<VisitStats>({
    queryKey: ['/api/page-visits/stats']
  });

  // Mutation para exclusão de contatos - usa apiRequest configurado
  const deleteContactMutation = useMutation({
    mutationFn: async (contactId: number) => {
      setDeletingContactId(contactId);
      const response = await apiRequest('DELETE', `/api/contacts/${contactId}`);
      return response.json();
    },
    onSuccess: (data, contactId) => {
      // Atualização otimista - remove imediatamente da UI
      queryClient.setQueryData(['/api/contacts'], (oldData: Contact[] | undefined) => {
        return oldData ? oldData.filter(contact => contact.id !== contactId) : [];
      });
      
      // Feedback visual de sucesso
      toast({
        title: "Contato excluído",
        description: "O contato foi removido com sucesso.",
        variant: "default",
      });
      
      setDeletingContactId(null);
      setConfirmDeleteId(null);
    },
    onError: (error, contactId) => {
      console.error('Erro ao excluir contato:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o contato. Tente novamente.",
        variant: "destructive",
      });
      
      setDeletingContactId(null);
      setConfirmDeleteId(null);
    }
  });
  
  // Registrar visita à página administrativa
  useEffect(() => {
    const recordVisit = async () => {
      try {
        await apiRequest("POST", "/api/page-visit", { page: "admin" });
      } catch (error) {
        console.error("Error recording page visit:", error);
      }
    };
    
    recordVisit();
  }, []);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Funções para controle de exclusão
  const handleDeleteClick = (contactId: number) => {
    setConfirmDeleteId(contactId);
  };

  const handleConfirmDelete = (contactId: number) => {
    deleteContactMutation.mutate(contactId);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  // Função para atualizar a lista de contatos e estatísticas
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), refetchStats()]);
    setIsRefreshing(false);
  };
  
  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout");
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0a0a0a] pt-16 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Painel do Administrador
          </motion.h1>
          
          <div className="flex gap-2">
            <motion.button
              className="flex items-center gap-2 bg-[#C084FC] hover:bg-[#C084FC]/80 text-white py-2 px-4 rounded-lg transition-all"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Atualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Atualizar
                </>
              )}
            </motion.button>
            
            <motion.button
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all"
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sair
            </motion.button>
          </div>
        </div>
        
        {/* Dashboard de estatísticas de visitas */}
        <motion.div
          className="bg-[#111]/60 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-[#4ADE80]" />
            Estatísticas de Visitas
          </h2>
          
          {isLoadingStats ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-[#4ADE80] animate-spin" />
              <span className="ml-2 text-gray-400">Carregando estatísticas...</span>
            </div>
          ) : isErrorStats ? (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">
              Erro ao carregar estatísticas. Por favor, tente novamente.
            </div>
          ) : visitStats ? (
            <>
              {/* Cards de estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 hover:border-[#4ADE80]/20 transition-all hover:shadow-lg hover:shadow-[#4ADE80]/5">
                  <div className="flex items-center mb-2">
                    <div className="bg-[#4ADE80]/20 p-2 rounded-lg mr-3">
                      <Eye className="w-5 h-5 text-[#4ADE80]" />
                    </div>
                    <span className="text-gray-400 text-sm">Total de Visitas</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{visitStats.totalVisits.toLocaleString()}</div>
                </div>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 hover:border-[#C084FC]/20 transition-all hover:shadow-lg hover:shadow-[#C084FC]/5">
                  <div className="flex items-center mb-2">
                    <div className="bg-[#C084FC]/20 p-2 rounded-lg mr-3">
                      <Activity className="w-5 h-5 text-[#C084FC]" />
                    </div>
                    <span className="text-gray-400 text-sm">Visitas Recentes (24h)</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{visitStats.recentVisits.toLocaleString()}</div>
                </div>
                
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5 hover:border-[#4ADE80]/20 transition-all hover:shadow-lg hover:shadow-[#4ADE80]/5 col-span-1 md:col-span-2">
                  <div className="flex items-center mb-2">
                    <div className="bg-[#4ADE80]/20 p-2 rounded-lg mr-3">
                      <BarChart2 className="w-5 h-5 text-[#4ADE80]" />
                    </div>
                    <span className="text-gray-400 text-sm">Páginas Mais Visitadas</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="text-left text-gray-400 font-medium py-1">Página</th>
                          <th className="text-right text-gray-400 font-medium py-1">Visitas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(visitStats.visitsByPage || {}).slice(0, 5).map(([page, count], index) => (
                          <tr key={index} className="border-t border-white/5">
                            <td className="py-2 text-white capitalize">{page}</td>
                            <td className="py-2 text-right text-[#4ADE80]">{count.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Gráfico de visitas diárias */}
              {visitStats.dailyStats.length > 0 && (
                <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/5">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#C084FC]/20 p-2 rounded-lg mr-3">
                      <Clock className="w-5 h-5 text-[#C084FC]" />
                    </div>
                    <span className="text-gray-400 text-sm">Visitas nos Últimos 7 Dias</span>
                  </div>
                  
                  <div className="h-40 flex items-end space-x-2">
                    {visitStats.dailyStats.map((day, index) => {
                      // Cálculo da altura do gráfico
                      const maxCount = Math.max(...visitStats.dailyStats.map(d => d.count));
                      const height = day.count > 0 ? (day.count / maxCount) * 100 : 5;
                      
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-gradient-to-t from-[#C084FC]/50 to-[#4ADE80]/50 rounded-t-sm relative group"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {day.count} visitas
                            </div>
                          </div>
                          <div className="text-gray-500 text-xs mt-1 truncate w-full text-center">
                            {new Date(day.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-blue-500/10 text-blue-300 p-8 rounded-lg text-center">
              Nenhuma estatística de visita disponível.
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-[#111]/60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3">
            Solicitações de Contato
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-[#C084FC] animate-spin" />
              <span className="ml-2 text-gray-400">Carregando contatos...</span>
            </div>
          ) : isError ? (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-lg text-center">
              Erro ao carregar contatos. Por favor, tente novamente.
            </div>
          ) : contacts && Array.isArray(contacts) && contacts.length > 0 ? (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {contacts.map((contact: Contact) => (
                  <motion.div 
                    key={contact.id}
                    className={`bg-[#1a1a1a] rounded-lg p-4 border border-white/5 hover:border-[#C084FC]/20 transition-all ${
                      deletingContactId === contact.id ? 'opacity-50 pointer-events-none' : ''
                    }`}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: deletingContactId === contact.id ? 0.5 : 1, 
                      y: 0, 
                      scale: 1 
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.9, 
                      y: -20,
                      transition: { duration: 0.3 }
                    }}
                    transition={{ duration: 0.5 }}
                    whileHover={deletingContactId !== contact.id ? { 
                      boxShadow: '0 0 10px rgba(192, 132, 252, 0.2)',
                      y: -2 
                    } : {}}
                    layout
                  >
                  <div className="flex justify-between flex-wrap gap-2 mb-3">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-[#4ADE80] mr-2" />
                      <h3 className="font-bold text-white text-lg">{contact.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Botão de exclusão com micro UX */}
                      <AnimatePresence>
                        {confirmDeleteId === contact.id ? (
                          <motion.div 
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span className="text-red-400 text-sm flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              Excluir?
                            </span>
                            <motion.button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-all"
                              onClick={() => handleConfirmDelete(contact.id)}
                              disabled={deletingContactId === contact.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {deletingContactId === contact.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                "Sim"
                              )}
                            </motion.button>
                            <motion.button
                              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm transition-all"
                              onClick={handleCancelDelete}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Não
                            </motion.button>
                          </motion.div>
                        ) : (
                          <motion.button
                            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all group"
                            onClick={() => handleDeleteClick(contact.id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                      
                      <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(contact.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-gray-300">
                      <Phone className="w-4 h-4 text-[#C084FC] mr-2" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <div className="w-4 h-4 text-[#4ADE80] mr-2 flex-shrink-0">🎉</div>
                      <span>Tipo de Evento: <span className="capitalize">{contact.eventType}</span></span>
                    </div>
                  </div>
                  
                  {contact.message && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <div className="flex items-start text-gray-400">
                        <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-1" />
                        <p>{contact.message || "Sem mensagem"}</p>
                      </div>
                    </div>
                  )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-blue-500/10 text-blue-300 p-8 rounded-lg text-center">
              Nenhuma solicitação de contato encontrada ainda.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}