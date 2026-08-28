"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

const logos = [
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/html5.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/css3.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nextdotjs.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nodedotjs.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/php.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/laravel.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linux.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg", size: 48 },
  { src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/supabase.svg", size: 48 },
];

export default function InteractiveBackground() {
  const mouse = useRef({ x: 0, y: 0 });

  // Track mouse position and expose as CSS variables for subtle parallax
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const getParallax = (i: number) => {
    const factor = (i + 1) * 0.015;
    return {
      x: `calc((var(--mouse-x) - 50vw) * ${factor})`,
      y: `calc((var(--mouse-y) - 50vh) * ${factor})`,
    };
  };

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 opacity-90" />
      {/* Subtle grid / circuit pattern */}
      <div
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2210%22 height=%2210%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M10 0 L0 0 0 10%22 stroke=%22rgba(255,255,255,0.04)%22 stroke-width=%220.5%22/%3E%3C/svg%3E')]"
      />
      {/* Floating tech logos */}
      {logos.map((logo, i) => (
        <motion.img
          key={i}
          src={logo.src}
          alt=""
          className="absolute opacity-10 blur-sm hidden sm:block"
          style={{
            width: `${logo.size}px`,
            height: `${logo.size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translate(${getParallax(i).x}, ${getParallax(i).y})`,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 120 + i * 20, ease: "linear" }}
        />
      ))}
      {/* Tiny floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-10 hidden sm:block"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 8 + 6,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
