"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  autoSlide?: boolean;
  interval?: number;
  children: React.ReactNode;
};

export default function HeroCarousel({
  children,
  autoSlide = true,
  interval = 5000,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const goToSlide = (index: number) => {
    const slides = document.querySelectorAll('.hero-slide');
    const totalSlides = slides.length;
    
    if (index >= totalSlides) {
      setCurrentIndex(0);
    } else if (index < 0) {
      setCurrentIndex(totalSlides - 1);
    } else {
      setCurrentIndex(index);
    }
  };

  const goToPrev = () => goToSlide(currentIndex - 1);
  const goToNext = () => goToSlide(currentIndex + 1);

  useEffect(() => {
    const slides = document.querySelectorAll('.hero-slide');
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev');
      if (index === currentIndex) {
        slide.classList.add('active');
      } else if (index === currentIndex - 1 || (currentIndex === 0 && index === slides.length - 1)) {
        slide.classList.add('prev');
      }
    });
  }, [currentIndex]);

  useEffect(() => {
    if (autoSlide) {
      timerRef.current = setInterval(() => {
        goToNext();
      }, interval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, autoSlide, interval]);

  return (
    <div className="hero-carousel-container">
      {children}
      
      <button 
        className="hero-nav hero-nav-prev" 
        onClick={goToPrev}
        onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
        onMouseLeave={() => {
          if (autoSlide) {
            timerRef.current = setInterval(() => {
              goToNext();
            }, interval);
          }
        }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        className="hero-nav hero-nav-next" 
        onClick={goToNext}
        onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
        onMouseLeave={() => {
          if (autoSlide) {
            timerRef.current = setInterval(() => {
              goToNext();
            }, interval);
          }
        }}
      >
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="scroll-indicator">
        <svg
          width="24"
          height="24"
          fill="none"
          stroke="white"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
