"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * AnimatedHero Component
 * 
 * A highly configurable Hero section with 5 distinct variants and staggered entrance animations.
 * 
 * Props:
 * - title (ReactNode): Main headline
 * - subtitle (String/Node): Tagline or badge text
 * - description (String): Supporting text
 * - variant (String): 'indigo' | 'aurora' | 'teal' | 'creative' | 'slate'
 * - overlay (ReactNode): Custom decorative elements or children (e.g., search bars)
 * - actions (ReactNode): Buttons or interactive elements
 * - className (String): Extra classes
 */

const variants = {
  indigo: {
    wrapper: "bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] text-white",
    badge: "bg-indigo-500/20 text-indigo-200 border-indigo-400/30",
    textGradient: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300",
    desc: "text-indigo-100/80",
    bgElement: (
      <>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1511795409835-a9f21b8718db?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-transparent via-[#1e1b4b]/80 to-[#1e1b4b]"></div>
      </>
    )
  },
  aurora: {
    wrapper: "bg-[#0f172a] text-white overflow-hidden",
    badge: "border-white/20 text-white backdrop-blur-md",
    textGradient: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400",
    desc: "text-slate-300",
    bgElement: (
      <>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/30 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-pink-600/30 blur-[100px] animate-pulse delay-700"></div>
      </>
    )
  },
  teal: {
    wrapper: "bg-gradient-to-br from-teal-50 via-white to-cyan-50 text-gray-900",
    badge: "bg-teal-100 text-teal-800",
    textGradient: "text-teal-600",
    desc: "text-gray-600",
    bgElement: (
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#0f766e 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
    )
  },
  creative: {
    wrapper: "bg-[#f8fafc] text-slate-900 overflow-hidden",
    badge: "text-indigo-500 font-bold tracking-wider uppercase bg-transparent p-0",
    textGradient: "italic text-indigo-600",
    desc: "text-slate-600",
    bgElement: (
      <>
        <div className="absolute top-10 left-[-5%] w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-10 right-[-5%] w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-[20%] w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </>
    )
  },
  slate: {
    wrapper: "bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden",
    badge: "bg-slate-700/50 text-slate-200 border-slate-600 backdrop-blur-sm",
    textGradient: "text-blue-400",
    desc: "text-slate-300",
    bgElement: (
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
    )
  }
};

export default function AnimatedHero({
  title,
  subtitle,
  description,
  variant = "indigo",
  overlay,
  actions,
  className
}) {
  const selectedVariant = variants[variant] || variants.indigo;
  
  return (
    <section className={cn("relative py-24 md:py-32", selectedVariant.wrapper, className)}>
      {selectedVariant.bgElement}

      <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
        <div className="max-w-4xl mx-auto md:mx-0 text-center">
          
          {/* Subtitle / Badge */}
          {subtitle && (
            <div className={cn(
              "inline-flex items-center gap-2 border px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in-up",
              selectedVariant.badge
            )}>
              {subtitle}
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up animation-delay-200">
            {typeof title === 'string' ? (
               <>
                {title.split(' ').slice(0, -2).join(' ')} <span className={selectedVariant.textGradient}>{title.split(' ').slice(-2).join(' ')}</span>
               </>
            ) : title}
          </h1>

          {/* Description */}
          {description && (
             <p className={cn("text-xl mb-8 leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-400", selectedVariant.desc)}>
               {description}
             </p>
          )}

          {/* Actions / Overlay Children */}
          {(actions || overlay) && (
            <div className="animate-fade-in-up animation-delay-600">
               {actions && <div className="flex flex-wrap justify-center gap-4 mb-8">{actions}</div>}
               {overlay && <div className="w-full max-w-lg mx-auto">{overlay}</div>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
