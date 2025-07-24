import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

// Array com todos os 10 vídeos solicitados
const backgroundVideos = [
  "https://adegavm.shop/e1.mp4",
  "https://adegavm.shop/e2.mp4",
  "https://adegavm.shop/e3.mp4",
  "https://adegavm.shop/e4.mp4",
  "https://adegavm.shop/e5.mp4",
  "https://adegavm.shop/e6.mp4",
  "https://adegavm.shop/e7.mp4",
  "https://adegavm.shop/e8.mp4",
  "https://adegavm.shop/e9.mp4",
  "https://adegavm.shop/e10.mp4",
];

// Tipos de transição
type TransitionType = "fade" | "slideLeft" | "slideRight" | "zoom";

export default function VideoBackground() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [nextVideoIndex, setNextVideoIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTransition, setCurrentTransition] = useState<TransitionType>("fade");
  const videoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);
  
  // Tempo de transição em milissegundos
  const TRANSITION_DURATION = 1500;
  
  // Duração do vídeo (se não for possível detectar o fim, mudamos após esse tempo)
  const VIDEO_DURATION = 30000; // 30 segundos para os novos vídeos, deixando mais tempo visível
  
  // Transições disponíveis
  const transitions: TransitionType[] = ["fade", "slideLeft", "slideRight", "zoom"];
  
  // Selecionar uma transição aleatória
  const getRandomTransition = (): TransitionType => {
    const randomIndex = Math.floor(Math.random() * transitions.length);
    return transitions[randomIndex];
  };
  
  // Alternar para o próximo vídeo com transição suave
  const goToNextVideo = () => {
    // Escolher uma transição aleatória
    const transition = getRandomTransition();
    setCurrentTransition(transition);
    
    // Iniciar transição
    setIsTransitioning(true);
    
    // Aguardar a transição e então alternar para o próximo vídeo
    setTimeout(() => {
      setCurrentVideoIndex(nextVideoIndex);
      const newNextIndex = (nextVideoIndex + 1) % backgroundVideos.length;
      setNextVideoIndex(newNextIndex);
      
      // Finalizar transição
      setIsTransitioning(false);
    }, TRANSITION_DURATION);
  };
  
  // Gerenciar ciclo de vida do vídeo e transições
  useEffect(() => {
    let videoTimer: NodeJS.Timeout | null = null;
    const videoElement = videoRef.current;
    
    // Iniciar o vídeo atual
    if (videoElement) {
      // Apenas carregar o vídeo e deixar o onLoadedData lidar com a reprodução
      videoElement.load();
      
      // Configurar evento de término do vídeo
      const handleVideoEnd = () => {
        goToNextVideo();
      };
      
      videoElement.addEventListener('ended', handleVideoEnd);
      
      // Backup: se o evento 'ended' não disparar, usamos um timer
      // Vamos aumentar o tempo para evitar trocar os vídeos muito rápido
      videoTimer = setTimeout(goToNextVideo, VIDEO_DURATION);
      
      // Adicionar ouvinte para problema de buffer (quando o vídeo trava)
      const handleStall = () => {
        console.log("Video stalled, going to next video");
        // Se o vídeo travar, tentar o próximo após 3 segundos
        const stallTimer = setTimeout(() => {
          if (videoElement.readyState < 3) { // Não tem dados suficientes
            goToNextVideo();
          }
        }, 3000);
        
        return () => clearTimeout(stallTimer);
      };
      
      videoElement.addEventListener('stalled', handleStall);
      
      return () => {
        if (videoTimer) clearTimeout(videoTimer);
        videoElement.removeEventListener('ended', handleVideoEnd);
        videoElement.removeEventListener('stalled', handleStall);
      };
    }
    
    return () => {
      if (videoTimer) clearTimeout(videoTimer);
    };
  }, [currentVideoIndex]);
  
  // Pré-carregar o próximo vídeo quando o índice mudar, mas com timeout para evitar sobrecarga
  useEffect(() => {
    if (nextVideoRef.current) {
      // Adicionar pequeno atraso para não sobrecarregar a largura de banda
      const preloadTimer = setTimeout(() => {
        nextVideoRef.current?.load();
      }, 1000); // Aguardar 1 segundo antes de pré-carregar
      
      return () => clearTimeout(preloadTimer);
    }
  }, [nextVideoIndex]);
  
  // Obter estilos de animação com base na transição atual
  const getAnimationStyle = (isEntering: boolean) => {
    switch (currentTransition) {
      case "slideLeft":
        return isEntering 
          ? { initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 } }
          : { animate: { x: '-100%', opacity: 0 } };
      case "slideRight":
        return isEntering 
          ? { initial: { x: '-100%', opacity: 0 }, animate: { x: 0, opacity: 1 } }
          : { animate: { x: '100%', opacity: 0 } };
      case "zoom":
        return isEntering 
          ? { initial: { scale: 1.2, opacity: 0 }, animate: { scale: 1, opacity: 1 } }
          : { animate: { scale: 1.2, opacity: 0 } };
      case "fade":
      default:
        return isEntering 
          ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
          : { animate: { opacity: 0 } };
    }
  };

  // Configurações de transição
  const transitionConfig = {
    duration: TRANSITION_DURATION / 1000, // em segundos para framer-motion
    ease: "easeInOut"
  };

  // Obter estilos para o vídeo atual e o próximo
  const currentVideoStyle = getAnimationStyle(false);
  const nextVideoStyle = getAnimationStyle(true);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none">
      {/* Vídeo atual - renderização condicional segura para evitar erro inserBefore */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={{ opacity: 1 }}
        animate={isTransitioning ? currentVideoStyle.animate : {}}
        transition={transitionConfig}
      >
        <video 
          ref={videoRef}
          className="w-full h-full object-cover pointer-events-none"
          muted 
          playsInline
          loop
          preload="metadata"
          src={backgroundVideos[currentVideoIndex]}
          onLoadedData={() => {
            // Quando os dados iniciais carregarem, remover o atributo preload para evitar mais downloads
            if (videoRef.current) {
              videoRef.current.play().catch(error => {
                console.error("Video play was prevented:", error);
              });
            }
          }}
          onError={(e) => {
            console.log("Error loading video:", e);
            // Se o vídeo atual falhar, tentar o próximo
            if (videoRef.current) {
              goToNextVideo();
            }
          }}
        />
      </motion.div>
      
      {/* Próximo vídeo (aparece durante a transição) - em um container separado */}
      {isTransitioning && (
        <motion.div
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={nextVideoStyle.initial}
          animate={nextVideoStyle.animate}
          transition={transitionConfig}
        >
          <video 
            ref={nextVideoRef}
            className="w-full h-full object-cover pointer-events-none"
            muted 
            playsInline
            loop
            preload="metadata"
            src={backgroundVideos[nextVideoIndex]}
            onLoadedData={() => {
              // Quando os dados iniciais carregarem, iniciar o vídeo
              if (nextVideoRef.current) {
                nextVideoRef.current.play().catch(error => {
                  console.error("Next video play was prevented:", error);
                });
              }
            }}
            onError={(e) => {
              console.log("Error loading next video:", e);
              // Se o próximo vídeo falhar, passar para o seguinte
              setNextVideoIndex((nextVideoIndex + 1) % backgroundVideos.length);
            }}
          />
        </motion.div>
      )}
      
      {/* Overlay gradiente com efeito iluminado nos cantos */}
      <div className="absolute inset-0 hero-overlay bg-gradient-to-b from-black/40 via-black/70 to-black/90 pointer-events-none"></div>
      
      {/* Efeitos de luz adicionais */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(192,132,252,0.15),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(74,222,128,0.15),transparent_50%)] pointer-events-none"></div>
    </div>
  );
}
