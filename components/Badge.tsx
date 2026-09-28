import { twMerge } from 'tailwind-merge';

type Variant = 'pending' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

const variantStyles: Record<Variant, string> = {
  pending: 'bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-300  ring-1 ring-amber-200  dark:ring-amber-700/40',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-700/40',
  warning: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 ring-1 ring-orange-200 dark:ring-orange-700/40',
  error:   'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300    ring-1 ring-red-200    dark:ring-red-700/40',
  info:    'bg-sky-100    text-sky-700    dark:bg-sky-900/30    dark:text-sky-300    ring-1 ring-sky-200    dark:ring-sky-700/40',
  neutral: 'bg-gray-100   text-gray-600   dark:bg-gray-800/60   dark:text-gray-400   ring-1 ring-gray-200   dark:ring-gray-700/40',
};

const dotStyles: Record<Variant, string> = {
  pending: 'bg-amber-500',
  success: 'bg-emerald-500',
  warning: 'bg-orange-500',
  error:   'bg-red-500',
  info:    'bg-sky-500',
  neutral: 'bg-gray-400',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

export default function Badge({ children, variant = 'info', dot = false, className }: BadgeProps) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={twMerge('w-1.5 h-1.5 rounded-full shrink-0', dotStyles[variant])} />}
      {children}
    </span>
  );
}
