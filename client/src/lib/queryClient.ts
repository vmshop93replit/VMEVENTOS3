import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
  // For deployed environments without backend, use localStorage
  if (typeof window !== 'undefined' && !window.location.hostname.includes('replit')) {
    return await handleLocalStorageAPI(method, url, data);
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

async function handleLocalStorageAPI(method: string, url: string, data?: unknown): Promise<Response> {
  // Simulate API responses using localStorage
  if (url.includes('/api/contact') && method === 'POST') {
    const contacts = JSON.parse(localStorage.getItem('vm-eventos-contacts') || '[]');
    const newContact = {
      ...(data as object),
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    contacts.unshift(newContact);
    localStorage.setItem('vm-eventos-contacts', JSON.stringify(contacts));
    return new Response(JSON.stringify(newContact), { status: 201 });
  }
  
  if (url.includes('/api/login') && method === 'POST') {
    const { username, password } = data as any;
    if (username === 'admvini' && password === '939393') {
      const user = { id: 1, username: 'admvini' };
      localStorage.setItem('vm-eventos-user', JSON.stringify(user));
      return new Response(JSON.stringify(user), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
  }
  
  if (url.includes('/api/logout') && method === 'POST') {
    localStorage.removeItem('vm-eventos-user');
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  
  if (url.includes('/api/page-visit') && method === 'POST') {
    const visits = JSON.parse(localStorage.getItem('vm-eventos-visits') || '[]');
    const newVisit = {
      ...(data as object),
      id: Date.now(),
      visited_at: new Date().toISOString()
    };
    visits.unshift(newVisit);
    localStorage.setItem('vm-eventos-visits', JSON.stringify(visits));
    return new Response(JSON.stringify(newVisit), { status: 201 });
  }

  // DELETE contact
  if (url.includes('/api/contacts/') && method === 'DELETE') {
    const contactId = url.split('/').pop();
    const contacts = JSON.parse(localStorage.getItem('vm-eventos-contacts') || '[]');
    const updatedContacts = contacts.filter((c: any) => c.id.toString() !== contactId);
    localStorage.setItem('vm-eventos-contacts', JSON.stringify(updatedContacts));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
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
    
    // For deployed environments, use localStorage
    if (typeof window !== 'undefined' && !window.location.hostname.includes('replit')) {
      if (url.includes('/api/contacts')) {
        // Inicializar dados demo se não existirem
        let contacts = JSON.parse(localStorage.getItem('vm-eventos-contacts') || '[]');
        if (contacts.length === 0) {
          contacts = [
            {
              id: 1,
              name: "Maria Silva",
              phone: "(11) 99999-1234",
              eventType: "casamento", 
              message: "Preciso de orçamento para casamento em dezembro",
              created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              name: "João Santos", 
              phone: "(11) 98888-5678",
              eventType: "corporativo",
              message: "Evento de fim de ano da empresa",
              created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 3,
              name: "Ana Costa",
              phone: "(11) 97777-9012", 
              eventType: "aniversario",
              message: "Festa de 18 anos da minha filha",
              created_at: new Date().toISOString()
            }
          ];
          localStorage.setItem('vm-eventos-contacts', JSON.stringify(contacts));
        }
        return contacts;
      }
      if (url.includes('/api/user')) {
        const user = localStorage.getItem('vm-eventos-user');
        if (!user) {
          if (unauthorizedBehavior === "returnNull") return null;
          throw new Error('Not authenticated');
        }
        return JSON.parse(user);
      }
      if (url.includes('/api/page-visits/stats')) {
        // Inicializar dados demo de visitas se não existirem
        let visits = JSON.parse(localStorage.getItem('vm-eventos-visits') || '[]');
        if (visits.length === 0) {
          visits = [
            {
              id: 1,
              page: "/",
              ip_address: "192.168.1.1", 
              user_agent: "Mozilla/5.0",
              visited_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              page: "/admin",
              ip_address: "192.168.1.1",
              user_agent: "Mozilla/5.0", 
              visited_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 3,
              page: "/",
              ip_address: "192.168.1.2",
              user_agent: "Mozilla/5.0",
              visited_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 4,
              page: "/", 
              ip_address: "192.168.1.3",
              user_agent: "Mozilla/5.0",
              visited_at: new Date().toISOString()
            }
          ];
          localStorage.setItem('vm-eventos-visits', JSON.stringify(visits));
        }
        
        const visitsByPageObj = visits.reduce((acc: any, visit: any) => {
          acc[visit.page] = (acc[visit.page] || 0) + 1;
          return acc;
        }, {});
        
        return {
          totalVisits: visits.length,
          visitsByPage: visitsByPageObj,
          recentVisits: visits.filter((v: any) => 
            new Date(v.visited_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).length,
          dailyStats: []
        };
      }
      if (url.includes('/api/page-visits')) {
        return JSON.parse(localStorage.getItem('vm-eventos-visits') || '[]');
      }
    }

    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
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
