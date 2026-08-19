"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ParallaxElementProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  as?: keyof typeof motion;
}

export function ParallaxElement({
  children,
  speed = 0.3,
  className = "",
  as: Tag = "div",
}: ParallaxElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  const MotionTag = motion[Tag as keyof typeof motion] as typeof motion.div;

  return (
    <div ref={ref} className={className}>
      <MotionTag style={reduce ? undefined : { y }}>{children}</MotionTag>
    </div>
  );
}
