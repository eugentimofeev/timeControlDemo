import { useLayoutEffect, useRef, useState } from 'react';

import { useResizeObserver } from 'usehooks-ts';

export const useTargetSize = () => {
    const [initialRect, setInitialRect] = useState({ width: 0, height: 0 });
    const ref = useRef();
    const { width, height } = useResizeObserver({
        ref: ref,
        box: 'border-box',
    });

    useLayoutEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();

            setInitialRect({
                width: rect.width,
                height: rect.height,
            });
        }
    }, []);

    return {
        ref,
        width: width ? width : initialRect.width,
        height: height ? height : initialRect.height,
    };
};
