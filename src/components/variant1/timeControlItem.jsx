import { forwardRef } from 'react';

import { getTimeControlItemViewTime } from './utils';

export const TimeControlItem = forwardRef(
    ({ index, dateSegment, timeStep, ...props }, ref) => {
        const size = parseInt(props.style.width);
        const [startDate] = dateSegment;
        const viewTime = getTimeControlItemViewTime({
            startDate,
            index,
            timeStep,
            size,
        });

        return (
            <div
                ref={ref}
                className="absolute left-0 top-0 flex h-full select-none flex-col justify-between"
                {...props}
            >
                <div className="relative flex h-[40px] w-full bg-steel-400 bg-cover bg-no-repeat" />

                <div className="bodySmallR text-steel-300">{viewTime}</div>
            </div>
        );
    },
);

TimeControlItem.displayName = 'TimeControlItem';
