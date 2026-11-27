import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-paddy text-white hover:bg-paddy-deep',
        board: 'bg-ink text-turmeric hover:bg-paddy-deep',
        outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-white',
        quiet: 'text-muted hover:text-ink underline-offset-4 hover:underline',
      },
      size: {
        md: 'h-11 px-5 text-base',
        lg: 'h-14 px-6 text-lg',
        sm: 'h-9 px-3 text-sm',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonStyles>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}
