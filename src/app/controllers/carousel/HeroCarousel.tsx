"use client";

import { Children, cloneElement, isValidElement, useEffect, useMemo, useState } from "react";

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
  const slides = useMemo(() => Children.toArray(children), [children]);
  const totalSlides = slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const normalizeIndex = (index: number) => {
    if (totalSlides === 0) {
      return 0;
    }

    if (index >= totalSlides) {
      return 0;
    }

    if (index < 0) {
      return totalSlides - 1;
    }

    return index;
  };

  const goToSlide = (index: number) => {
    const nextIndex = normalizeIndex(index);
    if (nextIndex === currentIndex) {
      return;
    }

    setLeavingIndex(currentIndex);
    setCurrentIndex(nextIndex);
  };

  const goToPrev = () => goToSlide(currentIndex - 1);
  const goToNext = () => goToSlide(currentIndex + 1);

  useEffect(() => {
    if (!autoSlide || isPaused || totalSlides <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((prevIndex) => {
        setLeavingIndex(prevIndex);
        return normalizeIndex(prevIndex + 1);
      });
    }, interval);

    return () => {
      window.clearInterval(timer);
    };
  }, [autoSlide, interval, isPaused, totalSlides]);

  const renderedSlides = slides.map((child, index) => {
    if (!isValidElement(child)) {
      return child;
    }

    const existingClassName = String((child.props as { className?: string }).className || "")
      .split(" ")
      .filter(Boolean)
      .filter((className) => !["active", "exiting", "prev", "next"].includes(className))
      .join(" ");

    const stateClassName = index === currentIndex
      ? "active"
      : index === leavingIndex
        ? "exiting"
        : "next";

    return cloneElement(child, {
      className: [existingClassName, stateClassName].filter(Boolean).join(" "),
    });
  });

  return (
    <div
      className="hero-carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {renderedSlides}
      
      <button 
        className="hero-nav hero-nav-prev" 
        onClick={goToPrev}
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
