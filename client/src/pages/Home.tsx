import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EventsSection from "@/components/EventsSection";
import HistorySection from "@/components/HistorySection";
import PackagesSection from "@/components/PackagesSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import MagicParticles from "@/components/MagicParticles";
import ScrollToTop from "@/components/ScrollToTop";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  // Registrar visita à página inicial
  useEffect(() => {
    const recordVisit = async () => {
      try {
        await apiRequest("POST", "/api/page-visit", { page: "home" });
      } catch (error) {
        console.error("Error recording page visit:", error);
      }
    };
    
    recordVisit();
  }, []);
  return (
    <main className="min-h-screen font-poppins overflow-x-hidden bg-black text-white relative">
      {/* Partículas "vagalumes" que flutuam por toda a página */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <MagicParticles />
      </div>
      
      {/* Efeito de ruído sutil para adicionar textura */}
      <div className="fixed inset-0 z-5 pointer-events-none noise-overlay opacity-20"></div>
      
      {/* Gradiente de fundo sutíl em mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none mesh-gradient-purple opacity-30"></div>
      
      <Navbar />
      <HeroSection />
      <EventsSection />
      <HistorySection />
      <PackagesSection />
      <AdvantagesSection />
      <ContactSection />
      <Footer />
      
      {/* Botão de voltar ao topo */}
      <ScrollToTop />
    </main>
  );
}
