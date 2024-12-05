import { useMemo, useRef, useState } from 'react';

import { getIndexFromTimestamp, getItems } from './utils';

export const useDateControl = ({ dateSegment, timestamp }) => {
    const [swiper, setSwiper] = useState(null);
    const items = useMemo(() => getItems(dateSegment), [dateSegment]);
    const initialSlideRef = useRef(null);

    if (!initialSlideRef.current) {
        initialSlideRef.current = getIndexFromTimestamp(timestamp, items);
    }

    return {
        swiper,
        setSwiper,
        items,
        initialSlide: initialSlideRef.current,
    };
};
