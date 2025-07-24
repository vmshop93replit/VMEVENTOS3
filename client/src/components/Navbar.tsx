import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Wine, Sparkles, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/use-mobile";

const navItems = [
  { href: "#events", label: "Eventos" },
  { href: "#history", label: "História" },
  { href: "#packages", label: "Pacotes" },
  { href: "#advantages", label: "Por Que Nós" },
  { href: "#contact", label: "Contato" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const isMobile = useMobile();
  const [location] = useLocation();

  // Detectar scroll para mudar aparência da navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
      
      // Detectar qual seção está visível
      const sections = ["hero", "events", "history", "packages", "advantages", "contact"];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section === "hero" ? "" : `#${section}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking on a link or outside the menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("click", handleClickOutside);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "py-2 glassmorphism-dark border-b border-[#C084FC]/20" 
            : "py-4 bg-transparent"
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="flex items-center gap-2 cursor-pointer group">
              <motion.span 
                className="relative"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Wine className="h-8 w-8 text-[#C084FC] group-hover:text-[#4ADE80] transition-colors duration-300" />
                <motion.span 
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Sparkles className="h-4 w-4 text-[#4ADE80]" />
                </motion.span>
              </motion.span>
              <div>
                <motion.span 
                  className={`text-2xl font-bold font-orbitron bg-gradient-to-r from-[#C084FC] to-[#4ADE80] bg-clip-text text-transparent inline-block transition-all duration-300 ${
                    scrolled ? "neon-glow" : ""
                  }`}
                >
                  VM Eventos
                </motion.span>
              </div>
            </div>
            
            {/* Efeito de luz por trás do logo quando com scroll */}
            {scrolled && (
              <div className="absolute -inset-1 blur-lg rounded-lg opacity-30 bg-gradient-to-r from-[#C084FC]/30 to-[#4ADE80]/30 -z-10"></div>
            )}
          </motion.div>

          {/* Links de navegação em desktop */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-full transition-all relative ${
                  activeSection === item.href 
                    ? "text-white" 
                    : "text-white/70 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {activeSection === item.href && (
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#C084FC]/20 to-[#4ADE80]/20 -z-10"
                    layoutId="navbar-active"
                    transition={{ type: "spring", duration: 0.6 }}
                  />
                )}
                {item.label}
                
                {/* Linha de destaque sob item ativo */}
                {activeSection === item.href && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-[2px] mx-auto w-1/2 bg-gradient-to-r from-[#C084FC] to-[#4ADE80]"
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.a>
            ))}
            
            {/* Botão de administração */}
            <Link to="/auth">
              <motion.div
                className={`ml-2 px-3 py-2 rounded-full transition-all relative flex items-center gap-1 bg-gradient-to-r from-[#C084FC]/20 to-[#4ADE80]/20 border border-[#C084FC]/30 ${
                  location === "/auth" || location === "/admin" 
                    ? "text-white" 
                    : "text-white/70 hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <Shield size={16} className="text-[#C084FC]" />
                <span>Admin</span>
              </motion.div>
            </Link>
          </div>

          {/* Botão de menu mobile */}
          <motion.button
            className="md:hidden relative focus:outline-none z-50 p-1"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 blur-md rounded-full opacity-50 bg-gradient-to-r from-[#C084FC]/30 to-[#4ADE80]/30 -z-10"></div>
            {isOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 bg-black/70 z-40 flex flex-col items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Efeito de gradiente no fundo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(192,132,252,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(74,222,128,0.15),transparent_50%)]"></div>
            
            <motion.div className="flex flex-col items-center justify-center space-y-6 relative">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className="text-2xl font-medium px-8 py-3 rounded-full hover:text-[#C084FC] transition-colors relative"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Efeito de luz por trás do item de menu */}
                  <motion.div 
                    className="absolute inset-0 rounded-full opacity-0 bg-gradient-to-r from-[#C084FC]/20 to-[#4ADE80]/20 -z-10"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {item.label}
                </motion.a>
              ))}
              
              {/* Botão de administração no menu mobile */}
              <Link to="/auth">
                <motion.div
                  className="text-2xl font-medium px-8 py-3 rounded-full relative flex items-center gap-2 bg-gradient-to-r from-[#C084FC]/20 to-[#4ADE80]/20 border border-[#C084FC]/30"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: navItems.length * 0.1,
                    ease: [0.22, 1, 0.36, 1] 
                  }}
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Shield size={18} className="text-[#C084FC]" />
                  <span>Administração</span>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
