"use client";

import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fadeUp" | "fadeIn" | "scale" | "slideRight";
}

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: { delay: i * 0.08, duration: 0.5 },
    }),
  },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
    }),
  },
};

export default function MotionSection({
  children,
  className = "",
  delay = 0,
  variant = "fadeUp",
}: MotionSectionProps) {
  const [visible, setVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <motion.div
      ref={setRef}
      custom={delay}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={variants[variant]}
      className={className}
    >
      {children}
    </motion.div>
  );
}
