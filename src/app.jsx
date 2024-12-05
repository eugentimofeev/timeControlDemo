import { useRef, useState } from 'react';

import { useEventListener } from 'usehooks-ts';

import DownloadIcon from '@/assets/icons/download.svg?react';
import ShareIcon from '@/assets/icons/share.svg?react';
import { INITIAL_TAB, TABS } from '@/config/tabs';
import { Button } from '@/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui';
import { cn } from '@/utils/cn';

export const App = () => {
    const containerRef = useRef();
    const [isHeaderHidden, setIsHeaderHidden] = useState(false);

    const onScroll = (event) => {
        setIsHeaderHidden(event.target.scrollTop > 20);
    };

    useEventListener('scroll', onScroll, containerRef);

    return (
        <Tabs asChild defaultValue={INITIAL_TAB}>
            <>
                <div
                    data-overlay
                    className={cn(
                        'fixed inset-0 bg-black-75',
                        'medium:bg-transparent',
                    )}
                />

                <div
                    data-drawer
                    className={cn(
                        'fixed bottom-0 left-0 right-0 top-8 flex flex-col overflow-hidden rounded-t-2xl bg-steel-50 shadow-[0_-1px_6px_0_#1B1D210A,0_-1px_8px_0px_#1B1D2114]',
                        'medium:left-4 medium:top-4 medium:w-[360px]',
                        'large:left-0 large:top-0 large:w-[672px] large:rounded-none',
                        'xLarge:w-[628px]',
                        'xxLarge:w-[704px]',
                    )}
                >
                    <div className="flex min-h-3 items-center justify-center bg-white">
                        <span className="h-1 w-16 rounded-full bg-steel-100" />
                    </div>

                    <div ref={containerRef} className="flex-1 overflow-y-auto">
                        <div
                            className={cn(
                                'bodyLargeM sticky top-0 z-10 flex h-14 items-center justify-center bg-white px-4 pb-2 text-steel-700',
                                isHeaderHidden &&
                                    'rounded-b-2xl shadow-[0_2px_4px_-1px_#1B1D210A,0_4px_6px_-1px_#1B1D2114]',
                            )}
                        >
                            Timecontrol Demo
                        </div>

                        <div className="rounded-b-2xl bg-white px-4 pb-4">
                            <TabsList className="w-full">
                                {TABS.map(({ value, title }) => (
                                    <TabsTrigger key={value} value={value}>
                                        {title}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div className="mt-2 rounded-2xl bg-white">
                            {TABS.map(({ value, Component }) => (
                                <TabsContent key={value} value={value}>
                                    <Component />
                                </TabsContent>
                            ))}

                            <div className="mt-6 flex gap-2 px-4 pb-4">
                                <Button
                                    className="flex-1 px-0"
                                    variant="secondary-color"
                                >
                                    <DownloadIcon className="mr-2 h-6 w-6" />
                                    Скачать
                                </Button>

                                <Button
                                    className="flex-1 px-0"
                                    variant="tertiary-color"
                                >
                                    <ShareIcon className="mr-2 h-6 w-6" />
                                    Поделиться
                                </Button>
                            </div>
                        </div>

                        <div className="mt-2 rounded-2xl bg-white p-4">
                            <div
                                className={cn(
                                    'aspect-[328/88] rounded-xl bg-steel-500',
                                    'large:aspect-[640/172]',
                                    'xLarge:aspect-[596/172]',
                                    'xxLarge:aspect-[672/188]',
                                )}
                            />
                        </div>
                    </div>
                </div>
            </>
        </Tabs>
    );
};
