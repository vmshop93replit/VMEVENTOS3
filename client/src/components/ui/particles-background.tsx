import { useCallback, useEffect, useState } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

// Configuração para o efeito "vagalumes mágicos"
export default function ParticlesBackground() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: false,
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        particles: {
          number: {
            value: windowSize.width < 768 ? 30 : 50,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: [
              "#C084FC", // Lilás
              "#4ADE80", // Verde neon
              "#F472B6", // Rosa
              "#60A5FA", // Azul
              "#FBBF24", // Laranja/Amarelo
            ],
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: { min: 0.3, max: 0.8 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 2, max: 5 },
            animation: {
              enable: true,
              speed: 2,
              minimumValue: 1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out",
            bounce: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
            },
          },
          life: {
            duration: {
              sync: false,
              value: 3,
            },
            count: 0,
            delay: {
              random: {
                enable: true,
                minimumValue: 0.5,
              },
              value: 1,
            },
          },
        },
        interactivity: {
          detectsOn: "canvas",
          events: {
            onHover: {
              enable: false,
            },
            onClick: {
              enable: false,
            },
            resize: true,
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-10 pointer-events-none"
    />
  );
}