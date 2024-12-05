/*
    pinch variant
    https://github.com/mdn/dom-examples/blob/main/pointerevents/Pinch_zoom_gestures.html
    https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures
*/
import { useRef } from 'react';

import { useEventListener } from 'usehooks-ts';

import { TIMESTAMP_CHANGE_SOURCES } from '@/config/controls';

import { PINCH_ZOOM_VALUES_DIFF } from './config';
import { offsetToTimestamp } from './utils';

const wheelEvent =
    'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
const wheelOption = { passive: false };

export const useTimeControlEvents = ({
    dateSegment,
    virtualizer,
    width,
    onTimestampChange,
    getEstimateSizes,
    updateZoom,
    scrollRef,
}) => {
    const eventCacheRef = useRef([]);
    const prevPinchDiff = useRef(-1);
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

    const pointerMoveZoomHandler = () => {
        if (eventCacheRef.current.length === 2) {
            const prevDif = prevPinchDiff.current;

            const currentDiff = Math.sqrt(
                Math.pow(
                    eventCacheRef.current[1].clientX -
                        eventCacheRef.current[0].clientX,
                    2,
                ) +
                    Math.pow(
                        eventCacheRef.current[1].clientY -
                            eventCacheRef.current[0].clientY,
                        2,
                    ),
            );

            if (prevDif > 0) {
                if (currentDiff - prevDif > PINCH_ZOOM_VALUES_DIFF) {
                    updateZoom(1);
                    prevPinchDiff.current = currentDiff;
                }

                if (currentDiff - prevDif < -PINCH_ZOOM_VALUES_DIFF) {
                    updateZoom(-1);

                    prevPinchDiff.current = currentDiff;
                }
            } else {
                prevPinchDiff.current = currentDiff;
            }
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
                const timestamp = offsetToTimestamp(
                    dateSegment[0].getTime(),
                    srollOffset,
                    getEstimateSizes()[1],
                );

                onTimestampChange(
                    timestamp,
                    TIMESTAMP_CHANGE_SOURCES.VIRTUALIZER,
                );
            }

            virtualizer.scrollToOffset(srollOffset);
        }
    };

    const pointerUpZoomHandler = () => {
        if (eventCacheRef.current.length < 2) {
            prevPinchDiff.current = -1;
        }
    };

    const onPointerDown = (event) => {
        addCacheEvent(event);
        pointerDownDragHandler(event);
    };

    const onPointerMove = (event) => {
        updateCacheEvent(event);
        pointerMoveZoomHandler();
        pointerMoveDragHandler(event);
    };

    const onPointerUp = (event) => {
        removeCacheEvent(event);
        pointerUpZoomHandler();
    };

    const onPointerCancel = (event) => {
        removeCacheEvents(event);
        pointerUpZoomHandler();
    };

    const onPointerLeave = () => {
        removeCacheEvents();
        pointerUpZoomHandler();
    };

    const onWheel = (event) => {
        event.preventDefault();
        updateZoom(event.deltaY >= 0 ? -1 : 1);
    };

    useEventListener(wheelEvent, onWheel, scrollRef, wheelOption);

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onPointerLeave,
    };
};
