import { cn } from '@/utils/cn';
import { getViewHMSDate } from '@/utils/date';

import { TimeControlItem } from './timeControlItem';
import { useTimeControlEvents } from './useTimeControlEvents';

export const TimeControl = ({
    width,
    dateSegment,
    timestamp,
    onTimestampChange,
    virtualizer,
    getEstimateSizes,
    scrollRef,
    count,
    updateZoom,
}) => {
    const timeControlEvents = useTimeControlEvents({
        dateSegment,
        virtualizer,
        width,
        onTimestampChange,
        getEstimateSizes,
        updateZoom,
        scrollRef,
    });

    return (
        <>
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="no-scrollbar h-[100px] touch-pan-y overflow-auto pt-8"
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
                                itemsCount={count}
                                index={virtual.index}
                                getEstimateSizes={getEstimateSizes}
                                dateSegment={dateSegment}
                                style={{
                                    width: `${virtual.size}px`,
                                    transform: `translateX(${virtual.start}px)`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
                    <div className="bodyLargeM rounded-lg bg-blue-500 px-2 py-[2px] text-white">
                        {getViewHMSDate(timestamp)}
                    </div>

                    <div
                        className={cn(
                            'relative mx-auto h-12 w-[2px] bg-blue-500',
                            'after:absolute after:h-1 after:w-1 after:rounded-full after:bg-blue-500',
                            'after:bottom-0 after:-translate-x-1/4 after:translate-y-1/2',
                            'before:absolute before:h-1 before:w-1 before:rounded-full before:bg-blue-500',
                            'before:top-0 before:-translate-x-1/4 before:-translate-y-1/2',
                        )}
                    />
                </div>
            </div>
        </>
    );
};
