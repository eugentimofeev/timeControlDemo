import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { TIMESTAMP_CHANGE_SOURCES } from '@/config/controls';
import { cn } from '@/utils/cn';

import { Item } from './item';

export const DateControl = ({
    items,
    className,
    onTimestampChange,
    setSwiper,
    initialSlide,
}) => {
    const slideChangeHandler = ({ activeIndex }) => {
        if (typeof onTimestampChange === 'function') {
            onTimestampChange(
                items[activeIndex].start,
                TIMESTAMP_CHANGE_SOURCES.SWIPER,
            );
        }
    };

    return (
        <Swiper
            className={cn('py-2', className)}
            slidesPerView="auto"
            spaceBetween={8}
            centeredSlides={true}
            resistanceRatio={0}
            onSwiper={setSwiper}
            onSlideChange={slideChangeHandler}
            runCallbacksOnInit={false}
            initialSlide={initialSlide}
        >
            {items.map((item, index) => (
                <SwiperSlide key={item.start} className="h-[52px] w-12">
                    {(props) => (
                        <Item time={item.start} index={index} {...props} />
                    )}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
