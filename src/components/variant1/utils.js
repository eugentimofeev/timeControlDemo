import { getViewHMDate } from '@/utils/date';

import {
    HOUR_STEP,
    MINUTE_STEP,
    VIRTUALIZER_DEFAULT_ESTIMATE,
    VIRTUALIZER_GAP,
} from './config';

export const getTimeControlItemsCount = ({ dateSegment, timeStep }) => {
    const [start, end] = dateSegment;

    return timeStep === HOUR_STEP
        ? (end - start) / timeStep + 1
        : (end - start) / timeStep;
};

export const getTimeControlEstimateSizes = ({ dateSegment, timeStep }) => {
    if (timeStep === MINUTE_STEP) {
        return [
            VIRTUALIZER_DEFAULT_ESTIMATE,
            VIRTUALIZER_DEFAULT_ESTIMATE,
            VIRTUALIZER_DEFAULT_ESTIMATE,
        ];
    }

    const [start, end] = dateSegment;

    let startW = VIRTUALIZER_DEFAULT_ESTIMATE;
    let endW = VIRTUALIZER_DEFAULT_ESTIMATE;

    const startTime = start.getTime();
    const dStart = new Date(startTime);

    if (dStart.getMinutes() !== 0) {
        dStart.setMinutes(0);

        const diffStart = startTime - dStart;
        const pStart = diffStart / (timeStep / 100);
        startW = startW - Math.round(pStart * (startW / 100));
    }

    const endTime = end.getTime();
    const dEnd = new Date(endTime);

    if (dEnd.getMinutes() !== 0) {
        dEnd.setMinutes(0);

        const diffEnd = endTime - dEnd;
        const pEnd = diffEnd / (timeStep / 100);
        endW = Math.round(pEnd * (endW / 100));
    }

    return [startW, VIRTUALIZER_DEFAULT_ESTIMATE, endW];
};

export const offsetToTimestamp = ({
    startTimestamp,
    srollOffset,
    middleEstimate,
    timeStep,
}) => {
    return Math.floor(
        startTimestamp +
            srollOffset * (timeStep / (middleEstimate + VIRTUALIZER_GAP)),
    );
};

export const timestampToOffset = ({
    startTimestamp,
    timestamp,
    middleEstimate,
    timeStep,
}) => {
    return Math.round(
        ((middleEstimate + VIRTUALIZER_GAP) * (timestamp - startTimestamp)) /
            timeStep,
    );
};

export const getTimeControlItemViewTime = ({
    startDate,
    index,
    timeStep,
    size,
}) => {
    if (size !== VIRTUALIZER_DEFAULT_ESTIMATE) {
        return null;
    }

    if (timeStep === HOUR_STEP) {
        const d = new Date(startDate);

        d.setMinutes(0);

        return getViewHMDate(d.getTime() + index * timeStep);
    }

    return getViewHMDate(startDate.getTime() + index * timeStep);
};
