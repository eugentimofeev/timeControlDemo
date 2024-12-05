import { createContext, forwardRef, useContext } from 'react';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const TabsContext = createContext('primary');

const tabsListVariants = cva(
    'inline-flex items-center justify-center p-[2px]',
    {
        variants: {
            variant: {
                primary: 'h-10 rounded-lg bg-steel-100',
                secondary: '',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    },
);

const tabsTriggerVariants = cva(
    cn(
        'actionMediumR bg-transparent rounded-md inline-flex items-center justify-center whitespace-nowrap h-full p-2 transition-all flex-1',
        'focus-visible:ring-steel-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'data-[state=active]:actionMediumM data-[state=active]:bg-white data-[state=active]:shadow-sm',
        'disabled:pointer-events-none disabled:opacity-50',
    ),
    {
        variants: {
            variant: {
                primary: 'h-10 rounded-lg bg-steel-100',
                secondary: '',
            },
        },
        defaultVariants: {
            variant: 'primary',
        },
    },
);

const Tabs = forwardRef(({ variant, ...props }, ref) => (
    <TabsContext.Provider value={variant}>
        <TabsPrimitive.Root ref={ref} {...props} />
    </TabsContext.Provider>
));

Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = forwardRef(({ className, ...props }, ref) => {
    const variant = useContext(TabsContext);

    return (
        <TabsPrimitive.List
            ref={ref}
            className={tabsListVariants({ className, variant })}
            {...props}
        />
    );
});

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = forwardRef(({ className, ...props }, ref) => {
    const variant = useContext(TabsContext);

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={tabsTriggerVariants({ variant, className })}
            {...props}
        />
    );
});

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn('ring-offset-2 focus-visible:outline-none', className)}
        {...props}
    />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
