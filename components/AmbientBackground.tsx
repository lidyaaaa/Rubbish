'use client';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* Subtle Radial Spotlight behind center cards */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,rgba(16,185,129,0.08),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_40%,rgba(16,185,129,0.06),rgba(9,11,16,0))]" 
      />

      {/* Ambient Orb 1: Emerald Glow (Top-Left) */}
      <div 
        className="absolute -top-24 -left-24 w-96 h-96 sm:w-[32rem] sm:h-[32rem] rounded-full bg-gradient-to-br from-emerald-400/35 via-emerald-500/25 to-teal-600/10 dark:from-emerald-500/20 dark:via-emerald-600/15 dark:to-transparent blur-[90px] sm:blur-[130px] animate-orb-1" 
      />

      {/* Ambient Orb 2: Soft Cyan & Sky Blue (Top-Right / Center-Right) */}
      <div 
        className="absolute top-1/4 -right-28 w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full bg-gradient-to-bl from-cyan-400/30 via-teal-300/20 to-sky-500/10 dark:from-cyan-500/15 dark:via-teal-500/10 dark:to-transparent blur-[80px] sm:blur-[120px] animate-orb-2" 
      />

      {/* Ambient Orb 3: Sage Green & Mint (Bottom-Left / Bottom-Center) */}
      <div 
        className="absolute -bottom-20 left-1/4 w-80 h-80 sm:w-[30rem] sm:h-[30rem] rounded-full bg-gradient-to-tr from-emerald-300/25 via-lime-200/20 to-teal-400/15 dark:from-emerald-600/15 dark:via-teal-700/10 dark:to-transparent blur-[80px] sm:blur-[120px] animate-orb-3" 
      />

      {/* Subtle Fine Grid Texture overlay for modern depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] opacity-40 dark:opacity-20" />
    </div>
  );
}
