"use client";

import { useState, useEffect, useCallback } from "react";

interface TypingTextProps {
  texts: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypingText({
  texts,
  typeSpeed = 80,
  deleteSpeed = 50,
  pauseDuration = 2500,
  className = "",
}: TypingTextProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentText = texts[textIndex] || "";

  const tick = useCallback(() => {
    if (!isDeleting) {
      // Typing
      if (charIndex < currentText.length) {
        setCharIndex((prev) => prev + 1);
      } else {
        // Finished typing, pause then delete
        setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        setCharIndex((prev) => prev - 1);
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [charIndex, currentText, isDeleting, pauseDuration, texts.length]);

  useEffect(() => {
    if (!mounted) return;
    const speed = isDeleting ? deleteSpeed : typeSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typeSpeed, deleteSpeed, mounted]);

  const displayed = currentText.slice(0, charIndex);

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      {/* Invisible spacer */}
      <span className="invisible" aria-hidden="true">
        {texts.reduce((a, b) => (a.length > b.length ? a : b))}
      </span>

      <span className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
        <span>{displayed}</span>
        <span
          className="ml-0.5 inline-block w-[2px] animate-pulse rounded-full bg-[#3b82f6] align-middle"
          style={{ height: "0.85em", marginTop: "0.05em" }}
        />
      </span>
    </span>
  );
}
