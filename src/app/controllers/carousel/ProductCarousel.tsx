"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  autoSlide?: boolean;
  interval?: number;
  children: React.ReactNode;
};

export default function ProductCarousel({
  children,
  autoSlide = true,
  interval = 3000,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);

  const getItemsPerScreen = () => {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 992) return 3;
    return 4;
  };

  const update = () => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;

    const card = track.children[0] as HTMLElement;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const width = card.offsetWidth + gap;

    const maxIndex = track.children.length - getItemsPerScreen();
    const safeIndex = index < 0 ? maxIndex : index > maxIndex ? 0 : index;

    track.style.transform = `translateX(-${safeIndex * width}px)`;
    if (safeIndex !== index) setIndex(safeIndex);
  };

  useEffect(() => {
    update();
  }, [index]);

  useEffect(() => {
    window.addEventListener("resize", update);

    if (autoSlide) {
      timerRef.current = setInterval(() => {
        setIndex(i => i + 1);
      }, interval);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div
      className="product-carousel-container"
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={() => {
        if (autoSlide) {
          timerRef.current = setInterval(() => {
            setIndex(i => i + 1);
          }, interval);
        }
      }}
    >
      <button className="carousel-nav-prev" onClick={() => setIndex(i => i - 1)}>
        ‹
      </button>

      <div className="product-carousel-track" ref={trackRef}>
        {children}
      </div>

      <button className="carousel-nav-next" onClick={() => setIndex(i => i + 1)}>
        ›
      </button>
    </div>
  );
}
