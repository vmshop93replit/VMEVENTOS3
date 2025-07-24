import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { supabaseAPI } from './supabase';

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Sempre usar Supabase para deployed environments
  if (typeof window !== 'undefined' && !window.location.hostname.includes('replit')) {
    return await handleSupabaseAPI(method, url, data);
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

async function handleSupabaseAPI(method: string, url: string, data?: unknown): Promise<Response> {
  // Use Supabase directly for all operations in deployed environments
  console.log(`🔄 Supabase API: ${method} ${url}`);
  
  if (url.includes('/api/contact') && method === 'POST') {
    try {
      const result = await supabaseAPI.createContact(data);
      return new Response(JSON.stringify(result), { status: 201 });
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      return new Response(JSON.stringify({ error: 'Failed to add contact' }), { status: 500 });
    }
  }
  
  if (url.includes('/api/login') && method === 'POST') {
    const { username, password } = data as any;
    try {
      const user = await supabaseAPI.login(username, password);
      return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
      console.error('Erro no login:', error);
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }
  }
  
  if (url.includes('/api/logout') && method === 'POST') {
    try {
      const result = await supabaseAPI.logout();
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Logout failed' }), { status: 500 });
    }
  }
  
  if (url.includes('/api/page-visit') && method === 'POST') {
    try {
      const result = await supabaseAPI.createPageVisit(data);
      return new Response(JSON.stringify(result), { status: 201 });
    } catch (error) {
      console.error('Erro ao registrar visita:', error);
      return new Response(JSON.stringify({ error: 'Failed to record visit' }), { status: 500 });
    }
  }

  // DELETE contact
  if (url.includes('/api/contacts/') && method === 'DELETE') {
    const contactId = parseInt(url.split('/').pop() || '0');
    try {
      const result = await supabaseAPI.deleteContact(contactId);
      return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete contact' }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    // Sempre usar Supabase (tanto local quanto deployed)
    console.log(`🔍 Query: ${url} (hostname: ${window?.location?.hostname})`);
    
    if (url.includes('/api/contacts')) {
      return await supabaseAPI.getContacts();
    }
    if (url.includes('/api/user')) {
      try {
        const user = await supabaseAPI.getUser();
        console.log('✅ Usuário autenticado:', user);
        return user;
      } catch (error) {
        console.log('❌ Falha na autenticação:', error);
        if (unauthorizedBehavior === "returnNull") return null;
        throw error;
      }
    }
    if (url.includes('/api/page-visits/stats')) {
      return await supabaseAPI.getVisitStats();
    }
    if (url.includes('/api/page-visits')) {
      return await supabaseAPI.getVisits();
    }
    
    // Se for Replit, usar API backend
    if (typeof window !== 'undefined' && window.location.hostname.includes('replit')) {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    }
    
    // Fallback para outros casos
    throw new Error(`Query não suportada: ${url}`);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});