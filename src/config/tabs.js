import { Variant1, Variant2 } from '@/components';

export const TABS = [
    { value: 0, title: 'Вариант 1', Component: Variant1 },
    { value: 1, title: 'Вариант 2', Component: Variant2 },
];

export const INITIAL_TAB = TABS[0].value;
