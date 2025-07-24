import React from 'react';
import { Instagram } from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function SocialButtons() {
  // Funções diretas para garantir que os links funcionem
  const goToInstagram = () => {
    const url = 'https://www.instagram.com/_adegavilamaria';
    window.location.href = url;
  };

  const goToWhatsApp = () => {
    const url = 'https://wa.me/5512982840118';
    window.location.href = url;
  };

  const goToTikTok = () => {
    const url = 'https://www.tiktok.com/@_adegavilamaria';
    window.location.href = url;
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-3">
      <button 
        onClick={goToInstagram}
        className="w-10 h-10 rounded-full bg-[#C084FC] flex items-center justify-center shadow-lg"
      >
        <Instagram className="h-5 w-5 text-white" />
      </button>
      
      <button
        onClick={goToWhatsApp}
        className="w-10 h-10 rounded-full bg-[#4ADE80] flex items-center justify-center shadow-lg"
      >
        <FaWhatsapp className="h-5 w-5 text-white" />
      </button>
      
      <button
        onClick={goToTikTok}
        className="w-10 h-10 rounded-full bg-[#FB7185] flex items-center justify-center shadow-lg"
      >
        <FaTiktok className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}