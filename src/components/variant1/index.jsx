import { useRef, useState } from 'react';

import {
    DateControl,
    getIndexFromTimestamp,
    useDateControl,
} from '@/components/dateControl';
import { Video } from '@/components/video';
import { ARCHIVE_DAYS, TIMESTAMP_CHANGE_SOURCES } from '@/config/controls';
import { useTargetSize } from '@/hooks';
import { cn } from '@/utils/cn';
import {
    getDateSegment,
    getInitialTimestamp,
    getViewFullDate,
    getViewHMSDate,
} from '@/utils/date';

import { HOUR_STEP, MINUTE_STEP } from './config';
import { TimeControl } from './timeControl';
import { useTimeControl } from './useTimeControl';
import { timestampToOffset } from './utils';

export const Variant1 = () => {
    const swiperSlideToBlockRef = useRef(false);
    const [timestamp, setTimestamp] = useState(getInitialTimestamp);
    const { ref, width } = useTargetSize();
    const [dateSegment] = useState(() => getDateSegment(ARCHIVE_DAYS));
    const dateControl = useDateControl({ dateSegment, timestamp });
    const hoursTimeControl = useTimeControl({
        width,
        dateSegment,
        timestamp,
        timeStep: HOUR_STEP,
    });
    const minutesTimeControl = useTimeControl({
        width,
        dateSegment,
        timestamp,
        timeStep: MINUTE_STEP,
    });

    const timestampChangeHandler = (timestamp, source, timeStep) => {
        setTimestamp(timestamp);

        const startTimestamp = dateSegment[0].getTime();
        const {
            virtualizer: hoursVirtualizer,
            getEstimateSizes: hoursGetEstimateSizes,
            timeStep: hoursTimeStep,
        } = hoursTimeControl;
        const {
            virtualizer: minutesVirtualizer,
            getEstimateSizes: minutesGetEstimateSizes,
            timeStep: minutesTimeStep,
        } = minutesTimeControl;

        if (source === TIMESTAMP_CHANGE_SOURCES.SWIPER) {
            if (swiperSlideToBlockRef.current) {
                swiperSlideToBlockRef.current = false;
                return;
            }

            const hoursOffset = timestampToOffset({
                middleEstimate: hoursGetEstimateSizes()[1],
                timeStep: hoursTimeStep,
                startTimestamp,
                timestamp,
            });
            const minutesOffset = timestampToOffset({
                middleEstimate: minutesGetEstimateSizes()[1],
                timeStep: minutesTimeStep,
                startTimestamp,
                timestamp,
            });

            hoursVirtualizer.scrollToOffset(hoursOffset);
            minutesVirtualizer.scrollToOffset(minutesOffset);
        } else if (source === TIMESTAMP_CHANGE_SOURCES.VIRTUALIZER) {
            const { items, swiper } = dateControl;
            const newIndex = getIndexFromTimestamp(timestamp, items);

            if (newIndex !== swiper.activeIndex) {
                swiperSlideToBlockRef.current = true;
                swiper.slideTo(newIndex);
            }

            const restVirtualizerData = {};

            switch (timeStep) {
                case HOUR_STEP:
                    restVirtualizerData.timeStep = MINUTE_STEP;
                    restVirtualizerData.virtualizer = minutesVirtualizer;
                    restVirtualizerData.getEstimateSizes =
                        minutesGetEstimateSizes;
                    break;
                case MINUTE_STEP:
                    restVirtualizerData.timeStep = HOUR_STEP;
                    restVirtualizerData.virtualizer = hoursVirtualizer;
                    restVirtualizerData.getEstimateSizes =
                        hoursGetEstimateSizes;

                    break;
                default:
                    return;
            }

            restVirtualizerData.virtualizer.scrollToOffset(
                timestampToOffset({
                    middleEstimate: restVirtualizerData.getEstimateSizes()[1],
                    timeStep: restVirtualizerData.timeStep,
                    startTimestamp,
                    timestamp,
                }),
            );
        }
    };
    return (
        <div ref={ref}>
            <Video>{getViewFullDate(timestamp)}</Video>

            <DateControl
                className="mt-2"
                onTimestampChange={timestampChangeHandler}
                {...dateControl}
            />

            <div className="relative">
                <TimeControl
                    className="h-[100px] pt-9"
                    dateSegment={dateSegment}
                    width={width}
                    onTimestampChange={timestampChangeHandler}
                    {...hoursTimeControl}
                />

                <TimeControl
                    className="h-20 pt-4"
                    dateSegment={dateSegment}
                    width={width}
                    onTimestampChange={timestampChangeHandler}
                    {...minutesTimeControl}
                />

                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
                    <div className="bodyLargeM rounded-lg bg-blue-500 px-2 py-[2px] text-white">
                        {getViewHMSDate(timestamp)}
                    </div>

                    <div
                        className={cn(
                            'relative mx-auto h-[134px] w-[2px] bg-blue-500',
                            'after:absolute after:h-1 after:w-1 after:rounded-full after:bg-blue-500',
                            'after:bottom-0 after:-translate-x-1/4 after:translate-y-1/2',
                            'before:absolute before:h-1 before:w-1 before:rounded-full before:bg-blue-500',
                            'before:top-0 before:-translate-x-1/4 before:-translate-y-1/2',
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
