import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import AuthPage from "@/pages/auth-page";
import ScrollToTop from "@/components/ScrollToTop";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest, getQueryFn } from "./lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Contexto de autenticação
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Provider de autenticação
function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 0,
    refetchOnMount: true,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout realizado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao fazer logout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error: error || null,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar o contexto de autenticação
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

// Componente para proteger rotas
function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  // Debug: verificar se o usuário está sendo carregado corretamente
  console.log("ProtectedRoute - user:", user, "isLoading:", isLoading);

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-black to-[#0a0a0a]">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Verificando autenticação...</p>
              </div>
            </div>
          );
        }

        if (!user) {
          console.log("ProtectedRoute - No user, redirecting to /auth");
          return <Redirect to="/auth" />;
        }

        console.log("ProtectedRoute - User authenticated, rendering component");
        return <Component />;
      }}
    </Route>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollToTop />
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
export { useAuth };
