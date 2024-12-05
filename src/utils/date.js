const createFormater = (options) => {
    const formater = new Intl.DateTimeFormat('ru', options);

    return (value) => {
        return formater.format(value);
    };
};

export const getViewHMDate = createFormater({
    hour: '2-digit',
    minute: '2-digit',
});

export const getViewHMSDate = createFormater({
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});

export const getViewFullDate = createFormater({
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
});

const getWeekday = createFormater({
    weekday: 'short',
});

export const getViewDay = (value) => {
    const date = new Date(value);
    const day = date.getDate();

    return { day, weekday: getWeekday(value) };
};

export const getDateSegment = (archiveDays) => {
    const end = new Date();
    const start = new Date();

    start.setDate(start.getDate() - archiveDays + 1);

    end.setSeconds(0);
    start.setSeconds(0);
    end.setMilliseconds(0);
    start.setMilliseconds(0);

    return [start, end];
};

export const getInitialTimestamp = () => {
    return new Date().getTime() - 1000 * 60 * 60 * 24 * 2;
};
