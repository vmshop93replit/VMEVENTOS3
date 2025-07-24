import React from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Users, GlassWater } from "lucide-react";

const advantages = [
  {
    icon: <Target className="h-10 w-10 text-[#C084FC]" />,
    title: "Nossa Missão",
    description: "Transformar seu evento em algo único, vivo e inesquecível. Através da arte da mixologia, do cuidado com os detalhes e de uma entrega cheia de estilo, criamos experiências que vão além do sabor — a gente marca momentos.",
    color: "border-[#C084FC]",
    bgColor: "bg-gradient-to-br from-[#C084FC]/30 to-[#C084FC]/10",
    emoji: "🎯",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-[#4ADE80]" />,
    title: "Experiência Única",
    description: "A VM não serve apenas drinks — a gente cria atmosfera. Cada evento é pensado como uma imersão sensorial, com receitas exclusivas, apresentações criativas e uma vibe que conecta todo mundo.",
    color: "border-[#4ADE80]",
    bgColor: "bg-gradient-to-br from-[#4ADE80]/30 to-[#4ADE80]/10",
    emoji: "🍸",
  },
  {
    icon: <Users className="h-10 w-10 text-[#C084FC]" />,
    title: "Equipe Qualificada",
    description: "Nosso time é formado por profissionais que amam o que fazem. Técnicos, criativos e cheios de presença, entregam mais que atendimento: entregam atitude, carisma e drinks inesquecíveis.",
    color: "border-[#C084FC]",
    bgColor: "bg-gradient-to-br from-[#C084FC]/30 to-[#C084FC]/10",
    emoji: "👨‍🍳",
  },
  {
    icon: <GlassWater className="h-10 w-10 text-[#4ADE80]" />,
    title: "Qualidade Premium",
    description: "Trabalhamos com insumos selecionados, destilados de alto padrão e técnicas modernas de mixologia. O resultado é um só: drinks impecáveis, com visual, aroma e sabor à altura do seu evento.",
    color: "border-[#4ADE80]",
    bgColor: "bg-gradient-to-br from-[#4ADE80]/30 to-[#4ADE80]/10",
    emoji: "🥃",
  },
];

export default function AdvantagesSection() {
  return (
    <section 
      id="advantages"
      className="py-20 bg-gradient-to-b from-black to-[#0F0F0F] relative noise-overlay" 
    >
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-4 text-shadow">
            <span className="bg-gradient-to-r from-[#C084FC] to-[#4ADE80] bg-clip-text text-transparent">
              Por que escolher a VM?
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C084FC] to-[#4ADE80] mx-auto"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className={`bg-black bg-opacity-60 p-6 rounded-xl border ${advantage.color} border-opacity-30 hover:border-opacity-100 transition-all duration-300 glassmorphism flex flex-col items-center text-center h-full`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className={`w-20 h-20 rounded-full ${advantage.bgColor} flex items-center justify-center mb-6`}>
                {advantage.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white flex items-center justify-center gap-2">
                <span className="text-3xl">{advantage.emoji}</span>
                {advantage.title}
              </h3>
              <p className="text-gray-300 text-md leading-relaxed">{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
