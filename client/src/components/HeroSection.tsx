import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import VideoBackground from "@/components/ui/video-background";
import ParticlesBackground from "@/components/ui/particles-background";
import { Wine } from "lucide-react";

// Função para rolagem suave até o elemento com o ID especificado
const scrollToSection = (id: string) => {
  console.log("Tentando rolar para a seção:", id);
  
  const element = document.getElementById(id);
  console.log("Elemento encontrado:", element);
  
  if (element) {
    console.log("Posição do elemento:", element.getBoundingClientRect().top);
    
    // Usando setTimeout para garantir que a função seja executada após a renderização completa
    setTimeout(() => {
      const topPos = element.getBoundingClientRect().top + window.scrollY;
      console.log("Rolando para posição:", topPos);
      
      window.scrollTo({
        top: topPos,
        behavior: "smooth"
      });
    }, 100);
  } else {
    console.error("Elemento não encontrado:", id);
  }
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden noise-overlay mesh-gradient-purple"
    >
      {/* Fundo de vídeo com rotatividade de imagens */}
      <VideoBackground />
      
      {/* Partículas animadas como "vagalumes mágicos" */}
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 z-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Efeito de brilho em formato circular atrás do título */}
          <div className="absolute inset-0 -top-20 -z-10 blur-3xl opacity-30 flex justify-center">
            <div className="w-[600px] h-[300px] rounded-full bg-gradient-to-r from-[#C084FC] via-[#8B5CF6] to-[#4ADE80] animate-pulse-glow"></div>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-8xl font-bold font-orbitron mb-8 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.div
              className="relative inline-block"
            >
              <motion.span
                className="bg-gradient-to-r from-[#C084FC] via-white to-[#4ADE80] bg-clip-text text-transparent inline-block"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >
                Transforme seu evento
              </motion.span>
              
              {/* Ícone de brilhos */}
              <motion.div 
                className="absolute -right-10 -top-10"
                animate={{ rotate: [0, 20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-10 w-10 text-[#C084FC]" />
              </motion.div>
            </motion.div>
            
            <span className="block mt-4 text-white text-shadow glow-text">
              com os drinks da VM
            </span>
          </motion.h1>
          
          <motion.div 
            className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-white/90 font-light relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Ícones decorativos de taças de bebidas */}
            <motion.div 
              className="absolute -left-5 md:-left-14 top-8"
              animate={{ 
                rotate: [-5, 5, -5],
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                repeatType: "mirror" 
              }}
            >
              <Wine className="h-8 w-8 md:h-12 md:w-12 text-[#4ADE80]/60" />
            </motion.div>
            
            <motion.div 
              className="absolute -right-5 md:-right-14 top-6"
              animate={{ 
                rotate: [5, -5, 5],
                y: [0, -7, 0]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity,
                repeatType: "mirror" 
              }}
            >
              <Wine className="h-8 w-8 md:h-12 md:w-12 text-[#C084FC]/60" />
            </motion.div>
            
            <span className="font-bold text-2xl md:text-3xl block mb-2 text-[#8B5CF6] glow-text">
              Experiências Sensoriais Únicas
            </span>
            
            <p>através da arte da mixologia para momentos inesquecíveis</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="relative"
          >
            {/* Efeito de luz por trás do botão */}
            <div className="absolute inset-0 blur-md opacity-60 bg-gradient-to-r from-[#C084FC]/40 to-[#4ADE80]/40 rounded-full"></div>
            
            <motion.button
              onClick={() => scrollToSection('events')}
              className="relative inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-[#C084FC] to-[#4ADE80] text-black font-bold rounded-full transition-all duration-300 neon-border uppercase tracking-wider text-lg"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(192, 132, 252, 0.7), 0 0 40px rgba(74, 222, 128, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              Descubra Mais
              <ChevronDown className="ml-2 animate-bounce" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Linha decorativa */}
      <div className="absolute bottom-28 left-0 right-0 flex justify-center">
        <div className="h-[2px] w-1/3 max-w-md bg-gradient-to-r from-transparent via-[#C084FC] to-transparent"></div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 text-center text-lg">
        <motion.button
          onClick={() => scrollToSection('events')}
          className="inline-block text-white opacity-80 hover:opacity-100 p-2 bg-transparent border-none cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "loop" 
          }}
          whileHover={{ 
            scale: 1.2,
            color: "#C084FC"
          }}
        >
          <ChevronDown size={30} className="animate-pulse" />
        </motion.button>
      </div>
    </section>
  );
}
