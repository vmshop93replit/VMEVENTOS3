import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Definição de tipos
type DrinkSection = {
  title: string;
  items: string[];
};

type PackageType = {
  title: string;
  textColor: string;
  buttonColor: string;
  textButtonColor?: string;
  // Outros campos necessários
};

interface DrinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PackageType;
  drinkSections: DrinkSection[];
}

export default function DrinksModal({ isOpen, onClose, pkg, drinkSections }: DrinksModalProps) {
  if (!isOpen) return null;

  const isLuxo = pkg.title === "Luxo";
  const isPremium = pkg.title === "Premium";
  
  // Determina qual emoji usar com base no tipo de pacote
  const packageEmoji = pkg.title === "Essencial" 
    ? "✅" 
    : pkg.title === "Premium" 
      ? "🌟" 
      : "💎";

  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="max-w-3xl w-full max-h-[85vh] bg-gradient-to-b from-black/95 to-black/90 border border-gray-800 rounded-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        style={{ 
          boxShadow: pkg.textColor.includes('4ADE80') 
            ? '0 0 35px rgba(74, 222, 128, 0.5)' 
            : '0 0 35px rgba(192, 132, 252, 0.5)' 
        }}
      >
        {/* Cabeçalho */}
        <div 
          className="py-8 px-6 border-b border-gray-800 flex justify-between items-center flex-shrink-0 relative"
          style={{
            background: pkg.textColor.includes('4ADE80')
              ? 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(74, 222, 128, 0.1))'
              : 'linear-gradient(to right, rgba(0,0,0,0.8), rgba(192, 132, 252, 0.1))'
          }}
        >
          {/* Círculo decorativo */}
          <div 
            className="absolute w-40 h-40 rounded-full opacity-10 -top-20 -right-20"
            style={{
              background: pkg.textColor.includes('4ADE80')
                ? 'radial-gradient(circle, rgba(74, 222, 128, 0.8) 0%, rgba(0,0,0,0) 70%)'
                : 'radial-gradient(circle, rgba(192, 132, 252, 0.8) 0%, rgba(0,0,0,0) 70%)'
            }}
          ></div>
          
          <div className="flex flex-col">
            <span className={`text-sm uppercase tracking-wider ${pkg.textColor} font-medium`}>
              {packageEmoji} Plano {pkg.title}
            </span>
            <h3 className="text-3xl font-bold text-white mt-1">
              Drinks do Plano {pkg.title}
            </h3>
          </div>
          
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none z-10 bg-black/30 rounded-full p-1"
          >
            <X size={28} />
          </button>
        </div>
        
        {/* Conteúdo */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
          {/* Grid organizado */}
          <div className={`grid grid-cols-1 ${isLuxo ? "md:grid-cols-2" : ""} gap-x-10 gap-y-1`}>
            {drinkSections.map((section, sectionIndex) => {
              // Determina o layout com base na categoria e plano
              let columnClass = "";
              
              if (section.title === "BASE") {
                columnClass = "col-span-full mb-6";
              } else if (section.title === "OBSERVAÇÕES") {
                columnClass = "col-span-full mt-6";
              } else if (isLuxo) {
                if (["CAIPIRINHAS", "BATIDAS", "ESPECIAIS COM JACK DANIELS"].includes(section.title)) {
                  columnClass = "col-span-1";
                } else if (["DRINKS COM LICOR 43", "SHOTS GOURMET (50ml)"].includes(section.title)) {
                  columnClass = "col-span-1";
                }
              }
              
              return (
                <div key={sectionIndex} className={`${columnClass} mb-4`}>
                  {/* Título da seção */}
                  {section.title === "BASE" ? (
                    <p className={`text-xl ${pkg.textColor} font-semibold mb-2 border-b border-gray-800 pb-2`}>
                      {section.items[0]}
                    </p>
                  ) : (
                    <p className={`text-lg ${pkg.textColor} font-bold mb-2 border-b border-gray-800 pb-2`}>
                      {section.title}
                    </p>
                  )}
                  
                  {/* Itens da seção, exceto BASE que já foi mostrada acima */}
                  {section.title !== "BASE" && (
                    <ul className="space-y-2 mt-3">
                      {section.items.map((item, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-center"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: (sectionIndex * 0.05) + (i * 0.02) }}
                        >
                          <div className={`h-2 w-2 rounded-full ${pkg.textColor} mr-3 flex-shrink-0`}></div>
                          <span className="text-gray-100 text-base">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Mensagem adicional para o plano Luxo */}
          {isLuxo && (
            <div 
              className="mt-6 p-4 rounded-lg" 
              style={{
                background: 'linear-gradient(to right, rgba(192, 132, 252, 0.05), rgba(192, 132, 252, 0.1))'
              }}
            >
              <div className="text-gray-300 text-sm">
                <p className="font-medium">
                  No evento, são servidos uma média de 250 produtos entre caipirinhas, batidas, drinks especiais e shots.
                </p>
              </div>
            </div>
          )}
          
          {/* Botão de fechar */}
          <motion.button 
            onClick={onClose}
            className={`mt-8 w-full py-4 px-6 bg-gradient-to-r ${pkg.buttonColor} ${pkg.textButtonColor || 'text-white'} font-bold rounded-lg transition-all shadow-lg`}
            whileHover={{ scale: 1.03 }}
          >
            Fechar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}