import React from "react";
import { motion } from "framer-motion";

const timeline = [
  {
    year: "2019",
    title: "Onde Tudo Começou — Adega VM",
    description: "Lá no interior paulista, em meio aos rolês com os amigos e encontros de família, o Vinicin começou a criar seus próprios drinks, só na base da criatividade e bom gosto. A parada ficou tão boa que virou costume. Foi aí que nasceu a adegavm.com.br — uma adega diferente, com entrega rápida e bebidas que já vinham com estilo.",
    color: "from-[#4ADE80] to-[#C084FC]",
    icon: "🥃"
  },
  {
    year: "2021",
    title: "A Ideia Cresceu",
    description: "Com a adega bombando e os pedidos cada vez mais personalizados, começou a surgir algo maior. Os drinks já estavam marcando presença em festas e eventos, e o feedback da galera era sempre o mesmo: \"isso aqui tem que estar nos eventos grandes!\". E foi assim que a ideia de profissionalizar virou plano de verdade.",
    color: "from-[#C084FC] to-[#4ADE80]",
    icon: "🚀"
  },
  {
    year: "2022",
    title: "Nasce a VM Eventos",
    description: "Foi nesse ano que o projeto tomou forma. A VM Eventos chegou com uma proposta ousada: levar mixologia de verdade pros eventos. Com barras temáticas, equipe bem treinada e drinks autorais, a marca conquistou espaço rápido em casamentos, festas exclusivas, aniversários, corporativos e eventos de música. Sempre com a mesma essência: qualidade, autenticidade e presença.",
    color: "from-[#4ADE80] to-[#C084FC]",
    icon: "🍸"
  },
  {
    year: "Hoje",
    title: "Do Subúrbio pro Palco Principal",
    description: "Hoje somos referência em drinks para eventos. Atendemos desde casamentos elegantes até festas com DJs, MCs e públicos exigentes. A VM entrega mais que bebidas — entrega experiências, com estilo, inovação e aquele toque que transforma qualquer evento num momento inesquecível.",
    color: "from-[#C084FC] to-[#4ADE80]",
    icon: "🏆"
  },
];

export default function HistorySection() {
  return (
    <section id="history" className="py-20 bg-gradient-to-b from-[#0F0F0F] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold mb-4 text-shadow">
            <span className="bg-gradient-to-r from-[#C084FC] to-[#4ADE80] bg-clip-text text-transparent">
              Nossa História
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#C084FC] to-[#4ADE80] mx-auto"></div>
        </motion.div>
        
        <div className="relative mx-auto max-w-5xl py-10">
          <div className="space-y-12">
            {timeline.map((event, index) => (
              <motion.div
                key={index}
                className="mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <div className="bg-[#111111] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-gray-700 transition-all">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${event.color} flex items-center justify-center text-xl mr-4`}>
                        {event.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#4ADE80] to-[#C084FC] bg-clip-text text-transparent">
                          {event.year}
                        </h3>
                        <h4 className="text-white font-bold text-lg">
                          {event.title}
                        </h4>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}