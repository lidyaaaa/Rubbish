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
        'p-6 rounded-2xl bg-clay-card dark:bg-clay-card-dark shadow-clay-sm dark:shadow-clay-dark-sm transition-all duration-250',
        hover && 'hover:-translate-y-1 hover:shadow-clay dark:hover:shadow-clay-dark cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
