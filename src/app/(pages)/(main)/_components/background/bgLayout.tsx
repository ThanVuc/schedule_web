'use client';

import { useEffect, useRef, useCallback } from 'react';
import './bgLayout.scss';

export const StarBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasGeneratedRef = useRef(false);

  const generateStars = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const pageHeight = window.innerHeight;
    const pageWidth = window.innerWidth;
    const numberOfStars = 50;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < numberOfStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';

      const top = Math.random() * pageHeight;
      const left = Math.random() * pageWidth;
      const size = Math.random() * 2 + 1;

      star.style.top = `${top}px`;
      star.style.left = `${left}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;

      star.style.setProperty('--delay', `${Math.random() * 4}s`);
      star.style.setProperty('--opacity', `${Math.random() * 0.5 + 0.3}`);

      fragment.appendChild(star);
    }

    container.innerHTML = '';
    container.appendChild(fragment);

    hasGeneratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasGeneratedRef.current) {
      requestAnimationFrame(generateStars);
    }

    const observer = new ResizeObserver(() => {
      if (observerTimeout.current) clearTimeout(observerTimeout.current);

      observerTimeout.current = setTimeout(() => {
        hasGeneratedRef.current = false;
        requestAnimationFrame(generateStars);
      }, 300);
    });

    observer.observe(document.body);

    return () => {
      observer.disconnect();
      if (observerTimeout.current) clearTimeout(observerTimeout.current);
    };
  }, [generateStars]);

  return (
    <div
      id="star-background"
      ref={containerRef}
      className="absolute top-0 left-0 h-screen w-full -z-10 overflow-hidden pointer-events-none bg-[#0B1120]"
    />
  );
};
