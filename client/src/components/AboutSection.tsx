import React from "react";
import { motion } from "framer-motion";
import { GlassWater, Users, Star, Sparkles } from "lucide-react";

const features = [
  {
    icon: <GlassWater className="h-10 w-10 text-[#C084FC]" />,
    title: "Experiência Única",
    description: "Criamos momentos inesquecíveis através de experiências sensoriais completas com drinks exclusivos e personalizados.",
    color: "border-[#C084FC]",
    bgColor: "bg-[#C084FC]/10",
    glowColor: "shadow-[#C084FC]/20",
  },
  {
    icon: <Users className="h-10 w-10 text-[#4ADE80]" />,
    title: "Equipe Qualificada",
    description: "Bartenders e profissionais treinados para oferecer o melhor atendimento e as mais criativas combinações de sabores.",
    color: "border-[#4ADE80]",
    bgColor: "bg-[#4ADE80]/10",
    glowColor: "shadow-[#4ADE80]/20",
  },
  {
    icon: <Star className="h-10 w-10 text-[#F472B6]" />,
    title: "Qualidade Premium",
    description: "Utilizamos apenas ingredientes de alta qualidade, destilados premium e técnicas modernas de mixologia para resultados impecáveis.",
    color: "border-[#F472B6]",
    bgColor: "bg-[#F472B6]/10",
    glowColor: "shadow-[#F472B6]/20",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Fundo com gradiente avançado */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0A0A] to-black -z-10"></div>
      
      {/* Efeito de mesh gradiente sutíl */}
      <div className="absolute inset-0 mesh-gradient-purple opacity-30 -z-5"></div>
      
      <div className="container mx-auto px-4 relative">
        <motion.div
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {/* Efeito decorativo */}
          <motion.div 
            className="absolute left-1/2 -top-6 transform -translate-x-1/2 opacity-70"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          >
            <Sparkles className="h-12 w-12 text-[#C084FC]" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-6xl font-orbitron font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-[#C084FC] via-white to-[#4ADE80] bg-clip-text text-transparent inline-block glow-text">
              Nossa Missão
            </span>
          </motion.h2>
          
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-[#C084FC] to-[#4ADE80] mx-auto rounded-full mb-8"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.4, duration: 1 }}
          ></motion.div>
          
          <motion.p 
            className="max-w-2xl mx-auto text-xl text-white/80 font-light"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            Transformamos seu evento em uma experiência mágica através de serviços de bar e mixologia de alta qualidade, criando momentos inesquecíveis para você e seus convidados.
          </motion.p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-10 relative z-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`bg-black/40 p-10 rounded-xl border ${feature.color} border-opacity-30 transition-all duration-500 glassmorphism-dark flex flex-col items-center text-center h-full group`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              whileHover={{ 
                y: -15,
                boxShadow: `0 10px 25px -5px ${feature.color.replace('border-', '')}30`,
              }}
            >
              {/* Ícone com animação */}
              <motion.div 
                className={`w-20 h-20 rounded-full ${feature.bgColor} flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {/* Efeito de brilho atrás do ícone */}
                <div className={`absolute inset-0 rounded-full blur-md ${feature.bgColor} opacity-60 -z-10 group-hover:opacity-100 transition-opacity`}></div>
                
                {feature.icon}
                
                {/* Partícula decorativa */}
                <motion.div 
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Título com transição de cor no hover */}
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[#C084FC] transition-all duration-300">
                {feature.title}
              </h3>
              
              <p className="text-gray-300 group-hover:text-white/90 transition-colors duration-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
