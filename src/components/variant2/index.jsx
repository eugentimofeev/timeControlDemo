import { useRef, useState } from 'react';

import {
    DateControl,
    getIndexFromTimestamp,
    useDateControl,
} from '@/components/dateControl';
import { Video } from '@/components/video';
import { ARCHIVE_DAYS, TIMESTAMP_CHANGE_SOURCES } from '@/config/controls';
import { useTargetSize } from '@/hooks';
import {
    getDateSegment,
    getInitialTimestamp,
    getViewFullDate,
} from '@/utils/date';

import { TimeControl } from './timeControl';
import { useTimeControl } from './useTimeControl';
import { timestampToOffset } from './utils';

export const Variant2 = () => {
    const swiperSlideToBlockRef = useRef(false);
    const [timestamp, setTimestamp] = useState(getInitialTimestamp);
    const { ref, width } = useTargetSize();
    const [dateSegment] = useState(() => getDateSegment(ARCHIVE_DAYS));
    const dateControl = useDateControl({ dateSegment, timestamp });
    const timeControl = useTimeControl({
        width,
        dateSegment,
        timestamp,
    });

    const timestampChangeHandler = (timestamp, source) => {
        if (source === TIMESTAMP_CHANGE_SOURCES.SWIPER) {
            if (swiperSlideToBlockRef.current) {
                swiperSlideToBlockRef.current = false;
                return;
            }

            const { virtualizer, getEstimateSizes } = timeControl;
            const offset = timestampToOffset(
                dateSegment[0].getTime(),
                timestamp,
                getEstimateSizes()[1],
            );

            virtualizer.scrollToOffset(offset);
        } else if (source === TIMESTAMP_CHANGE_SOURCES.VIRTUALIZER) {
            const { items, swiper } = dateControl;
            const newIndex = getIndexFromTimestamp(timestamp, items);

            if (newIndex !== swiper.activeIndex) {
                swiperSlideToBlockRef.current = true;
                swiper.slideTo(newIndex);
            }
        }

        setTimestamp(timestamp);
    };

    return (
        <div ref={ref}>
            <Video>{getViewFullDate(timestamp)}</Video>

            <DateControl
                className="mt-2"
                onTimestampChange={timestampChangeHandler}
                {...dateControl}
            />

            <TimeControl
                dateSegment={dateSegment}
                width={width}
                timestamp={timestamp}
                onTimestampChange={timestampChangeHandler}
                {...timeControl}
            />
        </div>
    );
};
