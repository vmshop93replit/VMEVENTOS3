import React from "react";
import { Link } from "wouter";
import { Instagram, FileText, AlertCircle, ExternalLink } from "lucide-react";
import { FaWhatsapp, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black py-10 border-t border-gray-800 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-orbitron bg-gradient-to-r from-[#C084FC] to-[#4ADE80] bg-clip-text text-transparent mb-4">
              VM Eventos
            </h3>
            <p className="text-gray-400 mb-4">
              Transformamos seu evento em algo único, vivo e inesquecível. Através da arte da mixologia, do cuidado com os detalhes e de uma entrega cheia de estilo.
            </p>
            <div className="flex space-x-4">
              {/* Link Instagram */}
              <a 
                href="https://www.instagram.com/_adegavilamaria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#C084FC]/30 flex items-center justify-center hover:bg-[#C084FC]/80 transition-all z-10"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              
              {/* Link WhatsApp */}
              <a 
                href="https://wa.me/5512982840118" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#4ADE80]/30 flex items-center justify-center hover:bg-[#4ADE80]/80 transition-all z-10"
              >
                <FaWhatsapp className="h-5 w-5 text-white" />
              </a>
              
              {/* Link TikTok */}
              <a 
                href="https://www.tiktok.com/@_adegavilamaria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#C084FC]/30 flex items-center justify-center hover:bg-[#C084FC]/80 transition-all z-10"
              >
                <FaTiktok className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Informações Legais</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4ADE80] transition-colors"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4ADE80] transition-colors"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4ADE80] transition-colors"
                >
                  Política de Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500">VM Eventos – Drinks que marcam momentos | Desde 2020</p>
          <p className="text-gray-600 text-sm mt-2">&copy; {new Date().getFullYear()} VM Eventos. Todos os direitos reservados.</p>
          <p className="text-gray-500 text-xs mt-3">Website desenvolvido por ArckaneCodex &reg;</p>
        </div>
      </div>
    </footer>
  );
}