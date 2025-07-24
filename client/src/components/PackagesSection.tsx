import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import DrinksModal from "./DrinksModal";

// Arrays organizados por categorias para melhor manutenção
const packages = [
  {
    title: "Essencial",
    price: "A partir de R$ 1.799",
    features: [
      "Bartender profissional (4h)",
      "Caipirinhas e batidas à vontade",
      "Estrutura básica de bar",
      "Até 50 convidados",
      "Pacote ajustável conforme evento",
    ],
    // Organizado por categorias para facilitar a renderização
    drinkSections: [
      {
        title: "BASE",
        items: ["Bebidas preparadas com Cachaça ou Vodka"]
      },
      {
        title: "CAIPIRINHAS",
        items: ["Limão", "Maracujá", "Morango", "Kiwi", "Abacaxi"]
      },
      {
        title: "BATIDAS",
        items: ["Limão", "Morango", "Maracujá", "Abacaxi"]
      },
      {
        title: "OBSERVAÇÕES",
        items: [
          "Todos os ingredientes são frescos e de alta qualidade",
          "Drinks podem ser servidos na versão alcoólica ou zero álcool"
        ]
      }
    ],
    color: "border-gray-700 hover:border-[#C084FC]",
    buttonColor: "from-[#C084FC] to-[#C084FC]/80 hover:from-[#C084FC] hover:to-[#C084FC]",
    textColor: "text-[#C084FC]",
    glowColor: "shadow-[0_0_15px_rgba(192,132,252,0.7)]",
    popular: false,
  },
  {
    title: "Premium",
    price: "A partir de R$ 2.399",
    features: [
      "2 Bartenders profissionais (5h)",
      "Caipirinhas, batidas e drinks especiais",
      "Bar completo com iluminação",
      "Até 50 convidados",
      "Decoração temática",
      "Pacote ajustável conforme evento",
    ],
    drinkSections: [
      {
        title: "BASE",
        items: ["Bebidas preparadas com Cachaça ou Vodka"]
      },
      {
        title: "CAIPIRINHAS",
        items: ["Limão", "Maracujá", "Morango", "Kiwi", "Abacaxi"]
      },
      {
        title: "BATIDAS",
        items: ["Limão", "Morango", "Maracujá", "Abacaxi"]
      },
      {
        title: "DRINKS ESPECIAIS",
        items: [
          "Caip Ice (Caipirinhas com Ice)",
          "Caip Cerva (Caipirinhas com Corona ou Heineken)"
        ]
      },
      {
        title: "OBSERVAÇÕES",
        items: [
          "Todos os ingredientes são frescos e de alta qualidade",
          "Drinks podem ser servidos na versão alcoólica ou zero álcool",
          "Até 2 frutas por drink"
        ]
      }
    ],
    color: "border-2 border-[#4ADE80]",
    buttonColor: "from-[#4ADE80] to-[#4ADE80]/80 hover:from-[#4ADE80] hover:to-[#4ADE80]",
    textColor: "text-[#4ADE80]",
    glowColor: "shadow-[0_0_15px_rgba(74,222,128,0.7)]",
    shadow: "shadow-[0_0_15px_rgba(74,222,128,0.7)]",
    textButtonColor: "text-black",
    popular: true,
  },
  {
    title: "Luxo",
    price: "A partir de R$ 3.999",
    features: [
      "2 Bartenders profissionais (6h)",
      "Open bar com drinks exclusivos e shots premium",
      "Bar temático com apresentação",
      "Até 50 convidados",
      "Consultoria personalizada",
      "Pacote ajustável conforme evento",
    ],
    drinkSections: [
      {
        title: "BASE",
        items: ["Bebidas preparadas com Cachaça, Vodka, Jack Daniels, Licor 43 e Balena"]
      },
      {
        title: "CAIPIRINHAS",
        items: ["Limão", "Maracujá", "Morango", "Kiwi", "Abacaxi"]
      },
      {
        title: "BATIDAS",
        items: ["Limão", "Morango", "Maracujá", "Abacaxi"]
      },
      {
        title: "DRINKS ESPECIAIS",
        items: [
          "Caip Ice (Caipirinhas com Ice)",
          "Caip Cerva (Caipirinhas com Corona ou Heineken)"
        ]
      },
      {
        title: "ESPECIAIS COM JACK DANIELS",
        items: [
          "Jack Maracujá",
          "Jack Limão",
          "Jack Maçã Verde com Kiwi"
        ]
      },
      {
        title: "DRINKS COM LICOR 43",
        items: [
          "43 Limão (Licor e limão)",
          "43 Maracujá (Licor e maracujá)",
          "43 Abacaxi (Licor, abacaxi e limão)",
          "43 Cerva (Licor, limão e Corona ou Heineken)",
          "Refresco (Licor 43, limão e laranja)",
          "Summer (Licor 43, morango e pêssego)",
          "Barbie (Licor Balena e Red Bull frutas vermelhas)"
        ]
      },
      {
        title: "SHOTS GOURMET (50ml)",
        items: [
          "Licor 43 Tradicional",
          "Licor 43 Chocolate",
          "Licor 43 Creme Brûlée",
          "Licor 43 Chocolate com Creme Brûlée",
          "Balena",
          "Balena com Licor 43 Chocolate"
        ]
      },
      {
        title: "OBSERVAÇÕES",
        items: [
          "Todos os ingredientes são frescos e de alta qualidade",
          "Drinks podem ser servidos na versão alcoólica ou zero álcool",
          "Até 2 frutas por drink"
        ]
      }
    ],
    color: "border-gray-700 hover:border-[#C084FC]",
    buttonColor: "from-[#C084FC] to-[#C084FC]/80 hover:from-[#C084FC] hover:to-[#C084FC]",
    textColor: "text-[#C084FC]",
    glowColor: "shadow-[0_0_15px_rgba(192,132,252,0.7)]",
    popular: false,
  },
];

export default function PackagesSection() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  
  const openModal = (index: number) => {
    setSelectedPlan(index);
  };
  
  const closeModal = () => {
    setSelectedPlan(null);
  };
  
  return (
    <section id="packages" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C084FC] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#4ADE80] opacity-10 rounded-full blur-3xl"></div>
      
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
              Nossos Pacotes
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#4ADE80] to-[#C084FC] mx-auto"></div>
          <p className="text-gray-300 mt-6 max-w-3xl mx-auto">
            Escolha o pacote ideal para o seu evento e surpreenda seus convidados com uma experiência única.
          </p>
          <div className="text-gray-400 mt-4 max-w-3xl mx-auto text-sm px-4">
            <p className="mb-3">
              Todos os nossos pacotes utilizam copos de 500ml e oferecem uma média de 4 drinks por pessoa, variando naturalmente de acordo com o perfil do público — alguns convidados consomem mais, outros menos.
            </p>
            <p>
              Os pacotes são flexíveis e podem ser ajustados conforme a necessidade e o orçamento do evento, garantindo sempre a melhor experiência possível.
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              className={`rounded-lg glassmorphism ${pkg.color} relative transition-all duration-300 ${pkg.shadow || ""} ${pkg.popular ? "transform scale-105 z-10" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-0 right-0 text-center">
                  <span className="bg-[#4ADE80] text-black px-4 py-1 rounded-full text-sm font-bold">
                    MAIS POPULAR
                  </span>
                </div>
              )}
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                <p className={`${pkg.textColor} font-semibold`}>{pkg.price}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`h-5 w-5 ${pkg.textColor} mt-1 mr-2 flex-shrink-0`} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 space-y-3">
                  <motion.button
                    onClick={() => openModal(index)}
                    className={`w-full text-center py-3 px-6 bg-black border-2 ${pkg.color.includes('border-2') ? pkg.color.replace('border-2', '') : pkg.color.replace('border-gray-700', 'border-gray-700').replace('hover:border-[#C084FC]', '')} ${pkg.textColor} font-bold rounded-lg transition-all focus:outline-none`}
                    whileHover={{ 
                      boxShadow: pkg.textColor.includes('4ADE80') 
                        ? '0 0 15px rgba(74, 222, 128, 0.7)' 
                        : '0 0 15px rgba(192, 132, 252, 0.7)',
                      scale: 1.02
                    }}
                  >
                    Ver Drinks
                  </motion.button>
                  
                  <a
                    href="#contact"
                    className={`block text-center py-3 px-6 bg-gradient-to-r ${pkg.buttonColor} ${pkg.textButtonColor || 'text-white'} font-bold rounded-lg transition-all`}
                  >
                    Solicitar Orçamento
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Usando o novo componente DrinksModal para exibir as bebidas */}
      <AnimatePresence>
        {selectedPlan !== null && (
          <DrinksModal
            isOpen={selectedPlan !== null}
            onClose={closeModal}
            pkg={packages[selectedPlan]}
            drinkSections={packages[selectedPlan].drinkSections}
          />
        )}
      </AnimatePresence>
    </section>
  );
}