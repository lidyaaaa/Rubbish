'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tilt?: boolean;
  delay?: number;
}

export default function TiltCard({
  children,
  className,
  tilt = true,
  delay = 0,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for mouse coordinates (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotational inertia
  const springConfig = { damping: 24, stiffness: 260, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  // Motion values for glare position in percentage
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const normalizedX = clientX / rect.width - 0.5;
    const normalizedY = clientY / rect.height - 0.5;

    x.set(normalizedX);
    y.set(normalizedY);
  }

  function handleMouseEnter() {
    if (tilt) setIsHovered(true);
  }

  function handleMouseLeave() {
    if (!tilt) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={
        tilt
          ? {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
              perspective: 1000,
            }
          : undefined
      }
      className={twMerge(
        'relative rounded-[2rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] dark:shadow-none transition-shadow duration-300 overflow-hidden',
        isHovered && 'shadow-[0_25px_60px_rgba(16,185,129,0.12)] dark:shadow-[0_0_40px_rgba(16,185,129,0.1)]',
        className
      )}
    >
      {/* Dynamic mouse glare effect */}
      {tilt && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            opacity: isHovered ? 0.6 : 0,
            background: `radial-gradient(400px circle at ${glareX} ${glareY}, rgba(16, 185, 129, 0.12), transparent 70%)`,
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
