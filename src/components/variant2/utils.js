import { getViewHMDate } from '@/utils/date';

import {
    DEFAULT_ESTIMATE,
    FIVE_MINUTES_STEP,
    HOUR_STEP,
    ZOOM_STEP,
} from './config';

export const getTimeControlItemsCount = (dateSegment) => {
    const [start, end] = dateSegment;

    return (end - start) / HOUR_STEP;
};

export const getTimeControlEstimateSizes = (dateSegment, zoom) => {
    const [start, end] = dateSegment;

    let startW = DEFAULT_ESTIMATE + ZOOM_STEP * zoom;
    let endW = DEFAULT_ESTIMATE + ZOOM_STEP * zoom;

    const startTime = start.getTime();
    const dStart = new Date(startTime);

    if (dStart.getMinutes() !== 0) {
        dStart.setMinutes(0);

        const diffStart = startTime - dStart;
        const pStart = diffStart / (HOUR_STEP / 100);
        startW = startW - Math.round(pStart * (startW / 100));
    }

    const endTime = end.getTime();
    const dEnd = new Date(endTime);

    if (dEnd.getMinutes() !== 0) {
        dEnd.setMinutes(0);

        const diffEnd = endTime - dEnd;
        const pEnd = diffEnd / (HOUR_STEP / 100);
        endW = Math.round(pEnd * (endW / 100));
    }

    return [startW, DEFAULT_ESTIMATE + ZOOM_STEP * zoom, endW];
};

export const getTimeControlItemVisibleSticks = ({
    middleEstimate,
    timeTarget,
    lastVisible = false,
}) => {
    let result = [0];

    if (!timeTarget) {
        return result;
    }

    const value = Math.round(middleEstimate / timeTarget.offsetWidth);

    if (value >= 5) {
        result = [0, 3, 6, 9];
    } else if (value >= 3) {
        result = [0, 6];
    }

    if (lastVisible) {
        result.push(12);
    }

    return result;
};

export const getTimeControlItemStickViewTime = ({
    intervalIndex,
    stickIndex,
    startTime,
}) => {
    const d = new Date(startTime);

    d.setHours(d.getHours() + intervalIndex);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    return getViewHMDate(d.getTime() + stickIndex * FIVE_MINUTES_STEP);
};

export const offsetToTimestamp = (
    startTimestamp,
    srollOffset,
    middleEstimate,
) => {
    return Math.floor(
        startTimestamp + srollOffset * (HOUR_STEP / middleEstimate),
    );
};

export const timestampToOffset = (
    startTimestamp,
    timestamp,
    middleEstimate,
) => {
    return Math.round(
        (middleEstimate * (timestamp - startTimestamp)) / HOUR_STEP,
    );
};
