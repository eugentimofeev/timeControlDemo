import { cn } from '@/utils/cn';

export const Video = ({ children, ...props }) => {
    return (
        <div
            className={cn(
                'bodyLargeM flex aspect-[360/202] w-full items-center justify-center rounded-2xl bg-steel-500 text-white',
                'large:aspect-[672/348]',
                'xLarge:aspect-[628/348]',
                'xxLarge:aspect-[704/396]',
            )}
            {...props}
        >
            {children}
        </div>
    );
};
