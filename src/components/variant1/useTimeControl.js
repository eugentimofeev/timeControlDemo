import { useCallback, useMemo, useRef } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import { VIRTUALIZER_GAP } from './config';
import {
    getTimeControlEstimateSizes,
    getTimeControlItemsCount,
    timestampToOffset,
} from './utils';

export const useTimeControl = ({ dateSegment, width, timestamp, timeStep }) => {
    const scrollRef = useRef();
    const count = useMemo(
        () => getTimeControlItemsCount({ dateSegment, timeStep }),
        [dateSegment, timeStep],
    );
    const estimateSizesRef = useRef();
    const initialOffsetRef = useRef(null);

    if (!estimateSizesRef.current) {
        estimateSizesRef.current = getTimeControlEstimateSizes({
            dateSegment,
            timeStep,
        });
    }

    if (!initialOffsetRef.current) {
        initialOffsetRef.current = timestampToOffset({
            startTimestamp: dateSegment[0].getTime(),
            middleEstimate: estimateSizesRef.current[1],
            timestamp,
            timeStep,
        });
    }

    const virtualizer = useVirtualizer({
        horizontal: true,
        count,
        paddingStart: width / 2,
        paddingEnd: width / 2,
        initialOffset: initialOffsetRef.current,
        gap: VIRTUALIZER_GAP,
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
        estimateSizesRef.current = getTimeControlEstimateSizes({
            dateSegment,
            timeStep,
        });
    }, [dateSegment, timeStep]);

    return {
        scrollRef,
        virtualizer,
        getEstimateSizes,
        updateEstimateSizes,
        timeStep,
    };
};
