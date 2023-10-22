'use client';

import { useState } from 'react';
import Slide from './components/slide';
import slides from './slides';

export function Slideshow() {
    const [currentSlide, setCurrentSlide] = useState(0);

    return (
        <div
            onKeyDown={(e) => {
                if (e.code === 'ArrowRight') {
                    setCurrentSlide(Math.min(currentSlide + 1, slides.length - 1));
                } else if (e.code === 'ArrowLeft') {
                    setCurrentSlide(Math.max(currentSlide - 1, 0));
                }
            }}
            className="h-full w-full overflow-hidden"
            tabIndex={0}
        >
            {slides.map((SlideContent, index) => (
                <Slide slideNumber={index} currentSlideNumber={currentSlide} key={index}>
                    <SlideContent />
                </Slide>
            ))}
        </div>
    );
}
