import React from "react";
import { motion } from "framer-motion";
import { Heart, Cake, Briefcase, GraduationCap, Music, Baby, Home, Palmtree } from "lucide-react";

const events = [
  {
    title: "Casamentos",
    description: "Se tem um dia que tem que ser perfeito, é esse. A VM chega com drinks pensados só pra vocês, estrutura completa e um visual que combina com o clima da cerimônia. Do brinde à pista de dança, a gente faz parte da sua história.",
    tag: "#CasamentoComEstilo",
    bgColor: "bg-gradient-to-br from-pink-900/20 to-purple-900/40",
    icon: <Heart className="h-6 w-6 text-[#C084FC]" />,
    hoverColor: "group-hover:text-[#C084FC]",
    shadow: "hover:shadow-[0_0_15px_rgba(192,132,252,0.7)]",
    imageUrl: "https://adegavm.shop/casamento.png",
  },
  {
    title: "Aniversários",
    description: "Seu dia, seu rolê, seu estilo. A gente monta o bar com sua cara, leva drinks autorais e aquele atendimento que deixa tudo mais leve e divertido. É comemoração de verdade, com sabor de memória boa.",
    tag: "#FestaComIdentidade",
    bgColor: "bg-gradient-to-br from-purple-900/20 to-blue-900/40",
    icon: <Cake className="h-6 w-6 text-[#4ADE80]" />,
    hoverColor: "group-hover:text-[#4ADE80]",
    shadow: "hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]",
    imageUrl: "https://adegavm.shop/aniversario.png",
  },
  {
    title: "Corporativos",
    description: "Quer impressionar geral? Deixa com a gente. Seja em evento de lançamento, reunião de equipe ou confraternização de fim de ano, a VM leva drinks de respeito e estrutura premium. É aquele toque que muda o jogo.",
    tag: "#EventoDePresença",
    bgColor: "bg-gradient-to-br from-blue-900/20 to-indigo-900/40",
    icon: <Briefcase className="h-6 w-6 text-[#C084FC]" />,
    hoverColor: "group-hover:text-[#C084FC]",
    shadow: "hover:shadow-[0_0_15px_rgba(192,132,252,0.7)]",
    imageUrl: "https://adegavm.shop/corporativo.png",
  },
  {
    title: "Formaturas",
    description: "Depois de tanto corre, você merece brindar em grande estilo. Drinks diferentes, ambiente montado no capricho e uma energia que combina com esse momento especial. Bora fazer história do jeito certo.",
    tag: "#FormeiComVM",
    bgColor: "bg-gradient-to-br from-indigo-900/20 to-green-900/40",
    icon: <GraduationCap className="h-6 w-6 text-[#4ADE80]" />,
    hoverColor: "group-hover:text-[#4ADE80]",
    shadow: "hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]",
    imageUrl: "https://adegavm.shop/formatura.png",
  },
  {
    title: "Shows, DJs & Open Bar",
    description: "A vibe já é alta, e o bar tem que acompanhar. A VM entra em cena com estrutura que encaixa no seu evento, atendimento rápido e drinks que combinam com a batida da noite.",
    tag: "#VMNoLineUp",
    bgColor: "bg-gradient-to-br from-green-900/20 to-yellow-900/40",
    icon: <Music className="h-6 w-6 text-[#C084FC]" />,
    hoverColor: "group-hover:text-[#C084FC]",
    shadow: "hover:shadow-[0_0_15px_rgba(192,132,252,0.7)]",
    imageUrl: "https://adegavm.shop/shows.png",
  },
  {
    title: "Chá Revelação e Chá de Bebê",
    description: "Tem jeito melhor de comemorar essa fase do que com um bar leve, criativo e do jeitinho que a família curte? A gente monta tudo com carinho e capricha nos drinks temáticos, com ou sem álcool.",
    tag: "#BrindeAoNovoCiclo",
    bgColor: "bg-gradient-to-br from-yellow-900/20 to-orange-900/40",
    icon: <Baby className="h-6 w-6 text-[#4ADE80]" />,
    hoverColor: "group-hover:text-[#4ADE80]",
    shadow: "hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]",
    imageUrl: "https://adegavm.shop/chabebe.png",
  },
  {
    title: "Eventos em Casa / VIP",
    description: "Vai fazer um evento mais reservado, em casa ou pra um grupo seleto? A VM leva tudo até você, com praticidade, bom gosto e aquela vibe de bar particular. É experiência de verdade no conforto do seu espaço.",
    tag: "#VMÉVIP",
    bgColor: "bg-gradient-to-br from-orange-900/20 to-red-900/40",
    icon: <Home className="h-6 w-6 text-[#C084FC]" />,
    hoverColor: "group-hover:text-[#C084FC]",
    shadow: "hover:shadow-[0_0_15px_rgba(192,132,252,0.7)]",
    imageUrl: "https://adegavm.shop/casavip.png",
  },
  {
    title: "Festas Temáticas",
    description: "Halloween, festa neon, tropical, flashback ou qualquer outra ideia: a gente entra no clima com tudo. Bar estiloso, drinks no tema e ambientação que combina com a festa.",
    tag: "#VMNoTema",
    bgColor: "bg-gradient-to-br from-red-900/20 to-pink-900/40",
    icon: <Palmtree className="h-6 w-6 text-[#4ADE80]" />,
    hoverColor: "group-hover:text-[#4ADE80]",
    shadow: "hover:shadow-[0_0_15px_rgba(74,222,128,0.7)]",
    imageUrl: "https://adegavm.shop/tematico.png",
  },
];

export default function EventsSection() {
  return (
    <section id="events" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#C084FC] opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#4ADE80] opacity-10 rounded-full blur-3xl -ml-20 -mb-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-4 text-shadow-green">
            <span className="bg-gradient-to-r from-[#4ADE80] to-[#C084FC] bg-clip-text text-transparent">
              Eventos que Atendemos
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#4ADE80] to-[#C084FC] mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={index}
              className={`group rounded-xl glassmorphism overflow-hidden transition-all duration-300 ${event.shadow}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 % 0.5 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={event.imageUrl} 
                  alt={`Evento: ${event.title}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative z-10 p-4 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 transform transition-all duration-300 group-hover:scale-110 ${event.hoverColor.replace('group-hover:', '')}`}>
                    {event.icon}
                  </div>
                </div>
              </div>
              <div className="p-5 flex flex-col h-64">
                <h3 className={`text-xl font-bold mb-2 text-white ${event.hoverColor} transition-colors`}>
                  {event.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed flex-grow overflow-y-auto custom-scrollbar">{event.description}</p>
                <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-800">
                  <span className="text-xs text-[#C084FC] font-medium">{event.tag}</span>
                  <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                    {event.icon}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
