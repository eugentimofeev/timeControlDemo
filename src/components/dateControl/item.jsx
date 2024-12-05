import { useSwiper } from 'swiper/react';

import { cn } from '@/utils/cn';
import { getViewDay } from '@/utils/date';

export const Item = ({ time, isActive, index }) => {
    const { day, weekday } = getViewDay(time);
    const swiper = useSwiper();

    const clickHandler = () => {
        if (!swiper) {
            return;
        }

        swiper.slideTo(index);
    };

    return (
        <div
            className={cn(
                'flex h-full w-full select-none flex-col items-center justify-between rounded-lg p-2 outline-none transition-colors',
                isActive ? 'bg-blue-500' : 'bg-white',
            )}
            onClick={clickHandler}
        >
            <div
                className={cn(
                    'bodyLargeM leading-5',
                    isActive ? 'text-white' : 'text-steel-700',
                )}
            >
                {day}
            </div>

            <div
                className={cn(
                    'bodySmallR capitalize leading-3',
                    isActive ? 'text-white' : 'text-steel-300',
                )}
            >
                {weekday}
            </div>
        </div>
    );
};
