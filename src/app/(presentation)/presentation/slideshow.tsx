'use client';

import { useState } from 'react';
import Slide from './components/slide';
import slides from './slides';

export function Slideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [previousSlide, setPreviousSlide] = useState(0);

    return (
        <div
            onKeyDown={(e) => {
                if (e.code === 'ArrowRight') {
                    setPreviousSlide(currentSlide);
                    setCurrentSlide(Math.min(currentSlide + 1, slides.length - 1));
                } else if (e.code === 'ArrowLeft') {
                    setPreviousSlide(currentSlide);
                    setCurrentSlide(Math.max(currentSlide - 1, 0));
                }
            }}
            className="h-full w-full"
            tabIndex={0}
        >
            {slides.map((SlideContent, index) => (
                <Slide
                    slideNumber={index}
                    currentSlideNumber={currentSlide}
                    previousSlideNumber={previousSlide}
                    key={index}
                >
                    <SlideContent />
                </Slide>
            ))}
        </div>
    );
}
