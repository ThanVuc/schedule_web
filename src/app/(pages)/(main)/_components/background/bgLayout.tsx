'use client';

import { useEffect, useRef, useState } from 'react';
import './bgLayout.scss';

export const StarBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [starsGenerated, setStarsGenerated] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || starsGenerated) return;

    const updateStars = () => {
      const pageHeight = document.body.scrollHeight;
      const pageWidth = window.innerWidth;
      const numberOfStars = Math.floor(pageHeight / 4);

      container.innerHTML = '';

      for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const top = Math.random() * pageHeight;
        const left = Math.random() * pageWidth;

        star.style.position = 'absolute';
        star.style.top = `${top}px`;
        star.style.left = `${left}px`;

        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.opacity = (Math.random() * 0.5 + 0.3).toString();

        container.appendChild(star);
      }

      container.style.height = `${pageHeight}px`;
      setStarsGenerated(true);
    };

    updateStars();

    // Optional: update stars if content height changes
    const observer = new ResizeObserver(() => {
      setStarsGenerated(false);
    });

    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, [starsGenerated]);

  return (
    <div
      id="star-background"
      ref={containerRef}
      className="absolute top-0 left-0 w-full -z-10"
    />
  );
};
