import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      console.log('🔄 Enviando credenciais:', credentials);
      const res = await apiRequest("POST", "/api/login", credentials);
      console.log('📡 Resposta do login:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error("Credenciais inválidas");
      }
      const result = await res.json();
      console.log('✅ Login bem-sucedido:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Login mutation success:', data);
      // Invalidar cache para recarregar dados de usuário
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Aguardar um pouco antes de redirecionar
      setTimeout(() => {
        console.log('🔄 Redirecionando para /admin');
        window.location.href = "/admin";
      }, 500);
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    },
    onError: (error: any) => {
      console.error('❌ Login mutation error:', error);
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Verifique suas credenciais e tente novamente",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-black to-[#0a0a0a]">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-2xl">
        {/* Formulário de Login */}
        <motion.div
          className="bg-[#111]/90 backdrop-blur-sm p-8 md:p-12"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Acesso Administrativo</h1>
            <p className="text-gray-400">Faça login para acessar o painel de gerenciamento</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-gray-300 mb-1 font-medium">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                className={`w-full bg-[#0a0a0a]/90 border ${
                  errors.username ? "border-red-500" : "border-gray-700 focus:border-[#C084FC]"
                } text-white px-4 py-3 rounded-lg focus:outline-none transition-all`}
                placeholder="Digite seu usuário"
                {...register("username")}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-300 mb-1 font-medium">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full bg-[#0a0a0a]/90 border ${
                    errors.password ? "border-red-500" : "border-gray-700 focus:border-[#C084FC]"
                  } text-white px-4 py-3 rounded-lg focus:outline-none transition-all`}
                  placeholder="Digite sua senha"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#C084FC] to-[#4ADE80] text-white font-bold rounded-lg hover:opacity-90 transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Seção de destaque */}
        <motion.div
          className="hidden md:block relative bg-gradient-to-br from-[#C084FC]/20 to-[#4ADE80]/20 p-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/admin-bg.jpg')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              VM Eventos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#C084FC]">
                Painel do Administrador
              </span>
            </h2>
            <p className="text-gray-300 mb-6">
              Gerencie contatos, monitore solicitações de clientes e acompanhe o desempenho do seu negócio.
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></span>
                Visualize todas as solicitações de contato
              </li>
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 bg-[#C084FC] rounded-full mr-2"></span>
                Acesse dados de clientes potenciais
              </li>
              <li className="flex items-center">
                <span className="inline-block w-2 h-2 bg-[#4ADE80] rounded-full mr-2"></span>
                Gerencie agendamentos e informações importantes
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}