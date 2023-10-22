import { Transition } from '@headlessui/react';

export default function Slide({
    slideNumber,
    currentSlideNumber,
    children,
}: {
    slideNumber: number;
    currentSlideNumber: number;
    children: React.ReactNode;
}) {
    return (
        <Transition
            show={slideNumber === currentSlideNumber}
            className="h-full w-full"
            enter="transition transform ease-out duration-200"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="transform transition ease-in duration-150"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-full"
        >
            {children}
            <div className="absolute bottom-0 right-0 p-4 text-muted-foreground">
                {(slideNumber + 1).toLocaleString()}
            </div>
        </Transition>
    );
}
