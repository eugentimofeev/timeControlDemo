import { cn } from '@/utils/cn';

import { TimeControlItem } from './timeControlItem';
import { useTimeControlEvents } from './useTimeControlEvents';

export const TimeControl = ({
    width,
    dateSegment,
    onTimestampChange,
    virtualizer,
    getEstimateSizes,
    scrollRef,
    timeStep,
    className,
}) => {
    const timeControlEvents = useTimeControlEvents({
        dateSegment,
        virtualizer,
        width,
        onTimestampChange,
        getEstimateSizes,
        timeStep,
    });

    return (
        <>
            <div
                ref={scrollRef}
                className={cn(
                    'no-scrollbar h-16 touch-pan-y overflow-auto',
                    className,
                )}
                {...timeControlEvents}
            >
                <div
                    className="relative h-full"
                    style={{ width: virtualizer.getTotalSize() }}
                >
                    {virtualizer.getVirtualItems().map((virtual) => (
                        <TimeControlItem
                            data-index={virtual.index}
                            key={virtual.key}
                            ref={virtualizer.measureElement}
                            index={virtual.index}
                            dateSegment={dateSegment}
                            timeStep={timeStep}
                            style={{
                                width: `${virtual.size}px`,
                                transform: `translateX(${virtual.start}px)`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};
