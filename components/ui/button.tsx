import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                'bg-brand inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}
