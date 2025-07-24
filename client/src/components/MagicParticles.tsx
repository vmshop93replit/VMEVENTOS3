import React, { useCallback } from "react";
import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function MagicParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // console.log(container);
  }, []);

  return (
    <Particles
      id="magic-particles"
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
            value: 30,
            density: {
              enable: true,
              value_area: 1200,
            },
          },
          color: {
            value: [
              "#C084FC", // Lilás
              "#4ADE80", // Verde
              "#F472B6", // Rosa
              "#60A5FA", // Azul
              "#FBBF24", // Dourado
            ],
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: { min: 0.2, max: 0.6 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 2, max: 6 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 1.5,
            direction: "none",
            random: true,
            straight: false,
            outModes: "out",
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200,
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