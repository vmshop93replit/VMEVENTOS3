import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Loader2, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().regex(/^\(\d{2}\)\s9\d{4}-\d{4}$/, "Formato deve ser (00) 90000-0000 com 11 dígitos"),
  event_type: z.string().min(1, "Selecione um tipo de evento"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormValues | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      event_type: "",
      message: "",
    },
  });

  // Para observar os valores do formulário em tempo real
  const formValues = watch();

  // Função para gerar URL do WhatsApp com mensagem formatada
  const generateWhatsAppLink = (data: FormValues) => {
    const eventTypeMap: Record<string, string> = {
      casamento: "Casamento",
      aniversario: "Aniversário",
      corporativo: "Evento Corporativo",
      formatura: "Formatura",
      outro: "Outro",
    };
    
    const eventTypeDisplay = eventTypeMap[data.event_type] || data.event_type;
    
    const message = `Olá, equipe da VM Eventos! Meu nome é ${data.name} e gostaria de obter mais informações sobre serviços para um evento do tipo ${eventTypeDisplay}.${data.message ? ` Observações: ${data.message}` : ""}`;
    
    return `https://wa.me/5512982840118?text=${encodeURIComponent(message)}`;
  };

  const mutation = useMutation({
    mutationFn: (data: FormValues) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: async (_, variables) => {
      // Guardar os dados enviados para exibir no modal
      setSubmittedData(variables);
      
      // Exibir modal de confirmação
      setShowConfirmation(true);
      
      // Limpar formulário
      reset();
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };
  
  // Fechar o modal de confirmação
  const closeConfirmation = () => {
    setShowConfirmation(false);
    setSubmittedData(null);
  };
  
  const formatPhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limitar a exatamente 11 dígitos
    if (value.length > 11) {
      value = value.substring(0, 11);
    }
    
    if (value.length <= 11) {
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 10) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
      }
      e.target.value = value;
    }
  };

  return (
    <section id="contact" className="py-20 bg-black relative z-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-4 text-shadow-green">
            <span className="bg-gradient-to-r from-[#4ADE80] to-[#C084FC] bg-clip-text text-transparent">
              Entre em Contato
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#4ADE80] to-[#C084FC] mx-auto"></div>
          <p className="text-gray-300 mt-6 max-w-2xl mx-auto">
            Preencha o formulário abaixo e receba um atendimento personalizado para o seu evento.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-white mb-2 font-semibold">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full bg-[#1A1A1A] border ${errors.name ? 'border-red-500' : 'border-gray-700 focus:border-[#C084FC]'} text-white px-4 py-3 rounded-lg focus:outline-none transition-all`}
                  placeholder="Seu nome completo"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-white mb-2 font-semibold">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="phone"
                  className={`w-full bg-[#1A1A1A] border ${errors.phone ? 'border-red-500' : 'border-gray-700 focus:border-[#C084FC]'} text-white px-4 py-3 rounded-lg focus:outline-none transition-all`}
                  placeholder="(00) 90000-0000"
                  {...register("phone")}
                  onChange={formatPhoneInput}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="event_type" className="block text-white mb-2 font-semibold">
                  Tipo de Evento
                </label>
                <select
                  id="event_type"
                  className={`w-full bg-[#1A1A1A] border ${errors.event_type ? 'border-red-500' : 'border-gray-700 focus:border-[#C084FC]'} text-white px-4 py-3 rounded-lg focus:outline-none transition-all`}
                  {...register("event_type")}
                >
                  <option value="" disabled>Selecione o tipo de evento</option>
                  <option value="casamento">Casamento</option>
                  <option value="aniversario">Aniversário</option>
                  <option value="corporativo">Evento Corporativo</option>
                  <option value="formatura">Formatura</option>
                  <option value="outro">Outro</option>
                </select>
                {errors.event_type && (
                  <p className="mt-1 text-sm text-red-500">{errors.event_type.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-white mb-2 font-semibold">
                  Mensagem (opcional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-[#1A1A1A] border border-gray-700 focus:border-[#C084FC] text-white px-4 py-3 rounded-lg focus:outline-none transition-all"
                  placeholder="Conte-nos mais sobre seu evento..."
                  {...register("message")}
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#C084FC] to-[#4ADE80] text-white font-bold rounded-lg hover:opacity-90 transition-all relative"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Solicitar Contato"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
          
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h3 className="text-2xl font-dancing text-white mb-4">Venha nos visitar</h3>
              <div className="rounded-lg overflow-hidden h-64">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.115196058857!2d-45.882726023737826!3d-23.196978959341945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc4a6fc4b1ddf7%3A0x9d65f35a25ddc63!2sR.%20Siqueira%20Campos%2C%20502%20-%20Centro%2C%20S%C3%A3o%20Jos%C3%A9%20dos%20Campos%20-%20SP%2C%2012210-090!5e0!3m2!1spt-BR!2sbr!4v1715475900782!5m2!1spt-BR!2sbr"
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#C084FC]/20 flex items-center justify-center mr-4">
                  <Phone className="h-5 w-5 text-[#C084FC]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Telefone / WhatsApp</p>
                  <p className="text-white">(12) 98284-0118</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#4ADE80]/20 flex items-center justify-center mr-4">
                  <Mail className="h-5 w-5 text-[#4ADE80]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">adegavilamariasjc@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#C084FC]/20 flex items-center justify-center mr-4">
                  <MapPin className="h-5 w-5 text-[#C084FC]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Endereço</p>
                  <p className="text-white">Rua Siqueira Campos, 502 - Centro, São José dos Campos, SP</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal de confirmação */}
      <Dialog open={showConfirmation} onOpenChange={closeConfirmation}>
        <DialogContent className="sm:max-w-md bg-[#0F0F0F] border border-[#333] text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2 text-center">
              <CheckCircle className="h-6 w-6 text-[#4ADE80]" />
              <span>Cadastro Realizado com Sucesso!</span>
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Seu pedido de contato foi enviado com sucesso. Um representante comercial entrará em contato em breve.
            </DialogDescription>
          </DialogHeader>
          
          {submittedData && (
            <div className="p-4 bg-[#151515] rounded-lg space-y-3 mb-4">
              <div>
                <p className="text-sm text-gray-400">Nome</p>
                <p className="font-medium">{submittedData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">WhatsApp</p>
                <p className="font-medium">{submittedData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tipo de Evento</p>
                <p className="font-medium capitalize">{submittedData.event_type}</p>
              </div>
              {submittedData.message && (
                <div>
                  <p className="text-sm text-gray-400">Mensagem</p>
                  <p className="font-medium">{submittedData.message}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <button 
              className="w-full py-3 bg-[#1D1D1D] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors"
              onClick={closeConfirmation}
            >
              Fechar
            </button>
            
            {submittedData && (
              <a 
                href={generateWhatsAppLink(submittedData)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 flex items-center justify-center gap-2 bg-[#25D366] text-white font-medium rounded-lg hover:bg-opacity-90 transition-all"
              >
                <Phone className="h-4 w-4" />
                Iniciar conversa no WhatsApp
              </a>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
