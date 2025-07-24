import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Sparkles } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar o botão quando o scroll passa de 500px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed right-5 bottom-5 md:right-8 md:bottom-8 z-50 p-3 rounded-full bg-black border border-[#C084FC]/30 group"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            boxShadow: [
              "0 0 0px rgba(192, 132, 252, 0)",
              "0 0 15px rgba(192, 132, 252, 0.5)",
              "0 0 5px rgba(192, 132, 252, 0.3)",
            ],
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            duration: 0.3,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Efeito gradiente atrás do botão */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C084FC]/20 to-[#4ADE80]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          
          {/* Ícone principal */}
          <ChevronUp className="h-6 w-6 text-white group-hover:text-[#C084FC] transition-colors duration-300" />
          
          {/* Efeito de brilho */}
          <motion.span 
            className="absolute top-0 right-0 -mt-1 -mr-1"
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
            <Sparkles className="h-3 w-3 text-[#4ADE80]" />
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
