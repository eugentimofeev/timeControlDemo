const getRange = (iteratorDate, endDate) => {
    if (
        iteratorDate.getFullYear() === endDate.getFullYear() &&
        iteratorDate.getMonth() === endDate.getMonth() &&
        iteratorDate.getDate() === endDate.getDate()
    ) {
        return {
            start: iteratorDate.getTime(),
            end: endDate.getTime(),
        };
    }

    return {
        start: iteratorDate.getTime(),
        end: new Date(
            iteratorDate.getFullYear(),
            iteratorDate.getMonth(),
            iteratorDate.getDate(),
            23,
            59,
            59,
        ).getTime(),
    };
};

export const getItems = (dateSegment) => {
    const [startDate, endDate] = dateSegment;
    const iteratorDate = new Date(startDate);

    const result = [];

    result.push(getRange(iteratorDate, endDate));

    iteratorDate.setDate(iteratorDate.getDate() + 1);
    iteratorDate.setHours(0);
    iteratorDate.setMinutes(0);
    iteratorDate.setSeconds(0);
    iteratorDate.setMilliseconds(0);

    while (iteratorDate <= endDate) {
        result.push(getRange(iteratorDate, endDate));
        iteratorDate.setDate(iteratorDate.getDate() + 1);
    }

    return result;
};

export const getIndexFromTimestamp = (timestamp, items) => {
    return items.findIndex(
        ({ start, end }) => timestamp >= start && timestamp <= end,
    );
};
