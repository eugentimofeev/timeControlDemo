const POINTS = {
    xSmall: 360,
    medium: 768,
    large: 1024,
    xLarge: 1280,
    xxLarge: 1440,
};

export const QUERIES = Object.fromEntries(
    Object.entries(POINTS).map(([key, value]) => [
        key,
        `(min-width: ${value}px)`,
    ]),
);

export const TAILWIND_SCREENS = Object.fromEntries(
    Object.entries(POINTS).map(([key, value]) => [key, `${value}px`]),
);
