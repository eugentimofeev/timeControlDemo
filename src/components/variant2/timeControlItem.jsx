import { forwardRef, useRef } from 'react';

import { cn } from '@/utils/cn';

import { TIME_CONTROL_ITEM_STICKS } from './config';
import {
    getTimeControlItemStickViewTime,
    getTimeControlItemVisibleSticks,
} from './utils';

export const TimeControlItem = forwardRef(
    ({ index, dateSegment, itemsCount, getEstimateSizes, ...props }, ref) => {
        const [start] = dateSegment;
        const timeRef = useRef();
        const middleEstimate = getEstimateSizes()[1];

        const visibleTimeIndexesArray = getTimeControlItemVisibleSticks({
            middleEstimate,
            timeTarget: timeRef.current,
            lastVisible: index === itemsCount - 1,
        });

        return (
            <div
                className="absolute left-0 top-0 flex h-full select-none flex-col items-center justify-between"
                ref={ref}
                {...props}
            >
                <div
                    className={cn(
                        index === 0
                            ? 'absolute right-0 top-0'
                            : index === itemsCount - 1
                              ? 'absolute left-0 top-0'
                              : 'w-full',
                    )}
                    style={
                        index === 0 || index === itemsCount - 1
                            ? { width: middleEstimate }
                            : { width: '100%' }
                    }
                >
                    <div className="flex h-[40px] items-end justify-between">
                        {TIME_CONTROL_ITEM_STICKS.map((_i, stickIndex) => (
                            <div
                                key={stickIndex}
                                className={cn(
                                    'relative w-[1px] bg-black',
                                    [0, 6, 12].includes(stickIndex)
                                        ? 'h-[80%]'
                                        : 'h-[50%]',
                                )}
                            >
                                {visibleTimeIndexesArray.includes(
                                    stickIndex,
                                ) && (
                                    <span
                                        ref={stickIndex === 0 ? timeRef : null}
                                        className="bodySmallR absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-steel-300"
                                    >
                                        {getTimeControlItemStickViewTime({
                                            intervalIndex: index,
                                            startTime: start,
                                            stickIndex,
                                        })}
                                    </span>
                                )}
                            </div>
                        ))}

                        <span />
                    </div>
                </div>
            </div>
        );
    },
);

TimeControlItem.displayName = 'TimeControlItem';
