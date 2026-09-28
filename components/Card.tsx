import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={twMerge(
        'p-6 sm:p-7 rounded-[1.75rem] bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] dark:shadow-none transition-all duration-300',
        hover && 'hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(16,185,129,0.12)] hover:border-emerald-500/30 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
