import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';

export default function Slide({
    slideNumber,
    currentSlideNumber,
    previousSlideNumber,
    children,
}: {
    slideNumber: number;
    currentSlideNumber: number;
    previousSlideNumber: number;
    children: React.ReactNode;
}) {
    return (
        <Transition
            show={slideNumber === currentSlideNumber}
            className="absolute h-full w-full"
            enter="transition transform ease-in-out duration-300"
            enterFrom={cn(previousSlideNumber < currentSlideNumber ? 'translate-x-full' : '-translate-x-full')}
            enterTo="translate-x-0"
            leave="transition transform ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo={cn(previousSlideNumber < currentSlideNumber ? '-translate-x-full' : 'translate-x-full')}
        >
            {children}
            <div className="absolute bottom-0 right-0 p-4 text-muted-foreground">
                {(slideNumber + 1).toLocaleString()}
            </div>
        </Transition>
    );
}
