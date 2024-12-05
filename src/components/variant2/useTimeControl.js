import { useCallback, useMemo, useRef } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { ZOOM_MINMAX } from './config';
import {
    getTimeControlEstimateSizes,
    getTimeControlItemsCount,
    timestampToOffset,
} from './utils';

export const useTimeControl = ({ dateSegment, width, timestamp }) => {
    const scrollRef = useRef();
    const count = useMemo(
        () => getTimeControlItemsCount(dateSegment),
        [dateSegment],
    );
    const estimateSizesRef = useRef();
    const initialOffsetRef = useRef(null);
    const zoomRef = useRef(ZOOM_MINMAX[0]);

    if (!estimateSizesRef.current) {
        estimateSizesRef.current = getTimeControlEstimateSizes(
            dateSegment,
            zoomRef.current,
        );
    }

    if (!initialOffsetRef.current) {
        initialOffsetRef.current = timestampToOffset(
            dateSegment[0].getTime(),
            timestamp,
            estimateSizesRef.current[1],
        );
    }

    const virtualizer = useVirtualizer({
        horizontal: true,
        count,
        paddingStart: width / 2,
        paddingEnd: width / 2,
        initialOffset: initialOffsetRef.current,
        getScrollElement: () => scrollRef.current,
        estimateSize: (index) => {
            const [start, middle, end] = estimateSizesRef.current;

            if (index === 0) {
                return start;
            } else if (index === count - 1) {
                return end;
            }

            return middle;
        },
    });

    const getEstimateSizes = useCallback(() => {
        return estimateSizesRef.current;
    }, []);

    const updateEstimateSizes = useCallback(() => {
        estimateSizesRef.current = getTimeControlEstimateSizes(
            dateSegment,
            zoomRef.current,
        );
    }, [dateSegment]);

    const updateZoom = (direction) => {
        const [MIN_ZOOM, MAX_ZOOM] = ZOOM_MINMAX;

        if (zoomRef.current === MIN_ZOOM && direction === -1) {
            return;
        }

        if (zoomRef.current === MAX_ZOOM && direction === 1) {
            return;
        }

        zoomRef.current = zoomRef.current + direction;

        if (zoomRef.current < MIN_ZOOM) {
            zoomRef.current = MIN_ZOOM;
        } else if (zoomRef.current > MAX_ZOOM) {
            zoomRef.current = MAX_ZOOM;
        }

        estimateSizesRef.current = getTimeControlEstimateSizes(
            dateSegment,
            zoomRef.current,
        );

        const maxOffset = virtualizer.getTotalSize() - width;
        const offset = timestampToOffset(
            dateSegment[0].getTime(),
            timestamp,
            estimateSizesRef.current[1],
        );

        virtualizer.measure();

        //todo: find better soludion to fix this shit
        //issue: scrollToOffset dont work if offset > maxOffset, BUT after .measure() we have correct maxOffset value
        if (offset > maxOffset) {
            setTimeout(() => {
                virtualizer.scrollToOffset(offset);
            }, 0);
        } else {
            virtualizer.scrollToOffset(offset);
        }
    };

    return {
        scrollRef,
        virtualizer,
        count,
        getEstimateSizes,
        updateEstimateSizes,
        updateZoom,
    };
};
