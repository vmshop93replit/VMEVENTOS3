# 🚀 Guia Completo: Integração Supabase para Projetos React/TypeScript

## 📋 Pré-requisitos
- Projeto React com TypeScript
- Vite como bundler
- TailwindCSS configurado
- React Query (@tanstack/react-query)

## 🔧 1. Instalação e Configuração Inicial

### Instalar Supabase Client
```bash
npm install @supabase/supabase-js
```

### Configurar Variáveis de Ambiente
Criar `.env.example`:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_SERVICE_KEY=your-service-key
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=password
```

## 🏗️ 2. Estrutura de Arquivos Essenciais

```
client/src/
├── lib/
│   ├── supabase.ts        # Cliente e API Supabase
│   └── queryClient.ts     # Configuração React Query
├── components/
│   └── ProtectedRoute.tsx # Proteção de rotas
├── pages/
│   ├── auth-page.tsx      # Página de login
│   └── Admin.tsx          # Dashboard administrativo
└── hooks/
    └── useAuth.ts         # Hook de autenticação
```

## 📝 3. Configuração do Cliente Supabase

### `client/src/lib/supabase.ts`
```typescript
import { createClient } from '@supabase/supabase-js';

// Configuração usando variáveis de ambiente
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "fallback-url";
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY || "fallback-key";

// Cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// API Functions
export const supabaseAPI = {
  // Buscar dados
  async getData(table: string) {
    console.log(`🔍 Buscando dados da tabela: ${table}`);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`❌ Erro ao buscar ${table}:`, error);
      return [];
    }
    
    console.log(`✅ ${data?.length || 0} registros encontrados em ${table}`);
    return data || [];
  },

  // Inserir dados
  async insertData(table: string, data: any) {
    console.log(`📝 Inserindo dados em ${table}:`, data);
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ Erro ao inserir em ${table}:`, error);
      throw error;
    }
    
    console.log(`✅ Dados inseridos com sucesso em ${table}`);
    return result;
  },

  // Deletar dados
  async deleteData(table: string, id: number) {
    console.log(`🗑️ Deletando registro ${id} da tabela ${table}`);
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`❌ Erro ao deletar de ${table}:`, error);
      throw error;
    }
    
    console.log(`✅ Registro ${id} deletado de ${table}`);
  },

  // Autenticação personalizada
  async authenticateUser(username: string, password: string) {
    console.log('🔐 Tentando autenticar usuário:', username);
    
    try {
      // Verificar usuário no Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (!error && data) {
        // Verificar credenciais (adapte conforme sua lógica)
        const adminUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
        const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'password';
        
        if (username === adminUser && password === adminPass) {
          const user = { id: data.id, username: data.username };
          localStorage.setItem('app-user', JSON.stringify(user));
          console.log('✅ Login bem-sucedido:', user);
          return user;
        }
      }
      
      // Fallback para desenvolvimento
      if (username === adminUser && password === adminPass) {
        const user = { id: 1, username: adminUser };
        localStorage.setItem('app-user', JSON.stringify(user));
        console.log('✅ Fallback: Login bem-sucedido:', user);
        return user;
      }
      
      throw new Error('Credenciais inválidas');
    } catch (error) {
      console.error('❌ Erro na autenticação:', error);
      throw error;
    }
  },

  // Verificar usuário logado
  async getUser() {
    const user = localStorage.getItem('app-user');
    if (!user) {
      throw new Error('Não autenticado');
    }
    
    const userData = JSON.parse(user);
    console.log('✅ Usuário autenticado:', userData);
    return userData;
  },

  // Logout
  async logout() {
    localStorage.removeItem('app-user');
    console.log('👋 Usuário deslogado');
  }
};
```

## 🔄 4. Configuração React Query

### `client/src/lib/queryClient.ts`
```typescript
import { QueryClient } from '@tanstack/react-query';
import { supabaseAPI } from './supabase';

// Cliente React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

// Função API unificada
export async function apiRequest(url: string, options: RequestInit = {}) {
  // Para endpoints customizados, use fetch normal
  if (url.startsWith('/api/')) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Para operações diretas no Supabase
  if (url === 'contacts') {
    return supabaseAPI.getData('contacts');
  }
  
  if (url === 'users') {
    return supabaseAPI.getUser();
  }

  throw new Error(`Endpoint não suportado: ${url}`);
}
```

## 🛡️ 5. Sistema de Autenticação

### `client/src/hooks/useAuth.ts`
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabaseAPI } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';

export function useAuth() {
  // Query para verificar usuário atual
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: () => supabaseAPI.getUser(),
    retry: false,
    staleTime: Infinity,
  });

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      supabaseAPI.authenticateUser(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: () => supabaseAPI.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}
```

### `client/src/components/ProtectedRoute.tsx`
```typescript
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Você precisa estar logado para acessar esta área.</p>
          <Link href="/auth" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
```

## 📊 6. Hooks para Operações CRUD

### Exemplo de Hook para Contatos
```typescript
// client/src/hooks/useContacts.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabaseAPI } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';

export function useContacts() {
  // Buscar contatos
  const contactsQuery = useQuery({
    queryKey: ['contacts'],
    queryFn: () => supabaseAPI.getData('contacts'),
  });

  // Adicionar contato
  const addContactMutation = useMutation({
    mutationFn: (contactData: any) => supabaseAPI.insertData('contacts', contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  // Deletar contato
  const deleteContactMutation = useMutation({
    mutationFn: (id: number) => supabaseAPI.deleteData('contacts', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  return {
    contacts: contactsQuery.data || [],
    isLoading: contactsQuery.isLoading,
    addContact: addContactMutation.mutate,
    deleteContact: deleteContactMutation.mutate,
    isAdding: addContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
}
```

## 🌐 7. Configuração para Deploy

### `vercel.json`
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "vite build",
        "outputDirectory": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Variáveis de Ambiente para Produção
No painel do Vercel, adicione:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_SERVICE_KEY=your-service-key
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=password
```

## 🎯 8. Schema Supabase Recomendado

### Tabelas Básicas
```sql
-- Usuários
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contatos/Leads
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  message TEXT,
  event_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visitas de Página
CREATE TABLE page_visits (
  id BIGSERIAL PRIMARY KEY,
  page VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## ✅ 9. Checklist de Implementação

### Configuração Inicial
- [ ] Instalar @supabase/supabase-js
- [ ] Criar projeto no Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Criar tabelas no Supabase

### Código Base
- [ ] Configurar cliente Supabase
- [ ] Implementar supabaseAPI
- [ ] Configurar React Query
- [ ] Criar hook useAuth
- [ ] Implementar ProtectedRoute

### Funcionalidades
- [ ] Sistema de login/logout
- [ ] CRUD operations
- [ ] Tratamento de erros
- [ ] Loading states
- [ ] Cache invalidation

### Deploy
- [ ] Configurar vercel.json
- [ ] Definir variáveis de ambiente
- [ ] Testar build local
- [ ] Deploy no Vercel

## 🚨 Dicas Importantes

1. **Sempre use variáveis de ambiente** para credenciais
2. **Implemente fallbacks** para desenvolvimento local
3. **Use console.log** abundantemente para debug
4. **Invalide cache** após mutations
5. **Trate erros** em todas as operações
6. **Use TypeScript** para type safety
7. **Teste localmente** antes do deploy

## 🔄 Padrão de Desenvolvimento

1. **Criar tabela no Supabase**
2. **Adicionar função na supabaseAPI**
3. **Criar hook específico**
4. **Implementar componentes**
5. **Testar funcionalidade**
6. **Deploy e validação**

Este guia garante uma integração sólida e reutilizável do Supabase em qualquer projeto React/TypeScript.