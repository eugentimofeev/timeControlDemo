import { useRef } from 'react';

import { TIMESTAMP_CHANGE_SOURCES } from '@/config/controls';

import { offsetToTimestamp } from './utils';

export const useTimeControlEvents = ({
    dateSegment,
    virtualizer,
    width,
    onTimestampChange,
    getEstimateSizes,
    timeStep,
}) => {
    const eventCacheRef = useRef([]);
    const maxOffsetRef = useRef(0);
    const pointerDownStartXRef = useRef(0);
    const pointerDownscrollOffsetRef = useRef(0);

    const addCacheEvent = (event) => {
        eventCacheRef.current.push(event);
    };

    const removeCacheEvent = (event) => {
        const index = eventCacheRef.current.findIndex(
            (e) => e.pointerId === event.pointerId,
        );

        if (index !== -1) {
            eventCacheRef.current.splice(index, 1);
        }
    };

    const removeCacheEvents = () => {
        eventCacheRef.current = [];
    };

    const updateCacheEvent = (event) => {
        const index = eventCacheRef.current.findIndex(
            (e) => e.pointerId === event.pointerId,
        );

        if (index !== -1) {
            eventCacheRef.current[index] = event;
        }
    };

    const pointerDownDragHandler = (event) => {
        const currentScrollOffset = virtualizer.scrollOffset;

        pointerDownStartXRef.current = event.clientX - currentScrollOffset;
        pointerDownscrollOffsetRef.current = currentScrollOffset;
        maxOffsetRef.current = virtualizer.getTotalSize() - width;
    };

    const pointerMoveDragHandler = (event) => {
        if (eventCacheRef.current.length === 1) {
            const currentScrollOffset = virtualizer.scrollOffset;
            const pointerMoveX = event.clientX - currentScrollOffset;
            const diff = (pointerMoveX - pointerDownStartXRef.current) * 0.6;

            let srollOffset = Math.round(
                pointerDownscrollOffsetRef.current - diff,
            );

            if (srollOffset <= 0) {
                srollOffset = 0;
            } else if (srollOffset > maxOffsetRef.current) {
                srollOffset = maxOffsetRef.current;
            }

            if (typeof onTimestampChange === 'function') {
                const timestamp = offsetToTimestamp({
                    startTimestamp: dateSegment[0].getTime(),
                    middleEstimate: getEstimateSizes()[1],
                    srollOffset,
                    timeStep,
                });

                onTimestampChange(
                    timestamp,
                    TIMESTAMP_CHANGE_SOURCES.VIRTUALIZER,
                    timeStep,
                );
            }

            virtualizer.scrollToOffset(srollOffset);
        }
    };

    const onPointerDown = (event) => {
        addCacheEvent(event);
        pointerDownDragHandler(event);
    };

    const onPointerMove = (event) => {
        updateCacheEvent(event);

        pointerMoveDragHandler(event);
    };

    const onPointerUp = (event) => {
        removeCacheEvent(event);
    };

    const onPointerCancel = (event) => {
        removeCacheEvents(event);
    };

    const onPointerLeave = () => {
        removeCacheEvents();
    };

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onPointerLeave,
    };
};
