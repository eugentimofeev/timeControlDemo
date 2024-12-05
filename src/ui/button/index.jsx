import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const variants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 focus-visible:outline-none disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary:
                    'bg-blue-500 text-white large:hover:bg-blue-600 active:bg-blue-700 focus-visible:ring-blue-500',
                'primary-red':
                    'bg-desctructive-500 text-white large:hover:bg-desctructive-600 active:bg-desctructive-700 focus-visible:ring-desctructive-500',
                'secondary-color':
                    'bg-blue-50 text-blue-500 large:hover:bg-blue-100 active:bg-blue-200 focus-visible:ring-blue-500',
                'secondary-gray':
                    'bg-white text-steel-700 large:hover:bg-steel-50 active:bg-steel-100 focus-visible:ring-steel-700 outline outline-1 outline-steel-300',
                'tertiary-color':
                    'bg-white text-blue-500 large:hover:bg-blue-100 active:bg-blue-200 focus-visible:ring-blue-500',
                'tertiary-gray':
                    'bg-white text-steel-700 large:hover:bg-steel-50 active:bg-steel-100 focus-visible:ring-steel-700',
                'link-color':
                    'bg-transparent text-blue-500 large:hover:text-blue-600 active:text-blue-700 focus-visible:ring-blue-500',
                'link-red':
                    'bg-transparent text-desctructive-500 large:hover:text-desctructive-600 active:text-desctructive-700 focus-visible:ring-desctructive-500',
                'link-gray':
                    'bg-transparent text-steel-700 large:hover:text-steel-800 active:text-steel-900 focus-visible:ring-steel-700',
                'outline-color':
                    'text-blue-500 bg-white large:hover:bg-blue-100 active:bg-blue-200 outline outline-1 outline-blue-500 focus-visible:ring-blue-500',
                'outline-gray':
                    'text-blue-500 bg-white large:hover:bg-steel-50 active:bg-steel-100 outline outline-1 outline-steel-100 focus-visible:ring-steel-700',
            },
            size: {
                large: 'actionLargeM px-14 py-[18px]',
                medium: 'actionMediumM px-[55px] py-[14px]',
                small: 'actionMediumM px-[55px] py-[10px]',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'large',
        },
    },
);

export const Button = forwardRef(
    (
        { children, asChild = false, variant, size, className, ...props },
        ref,
    ) => {
        const Component = asChild ? Slot : 'button';

        return (
            <Component
                ref={ref}
                className={cn(variants({ variant, size, className }))}
                {...props}
            >
                {children}
            </Component>
        );
    },
);

Button.displayName = 'Button';
