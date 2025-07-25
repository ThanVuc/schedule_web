'use client';

import { useEffect, useRef, useCallback } from 'react';
import './bgLayout.scss';

export const StarBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasGeneratedRef = useRef(false);

  const generateStars = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use the total scrollable height for stars
    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight
    );

    const pageWidth = window.innerWidth;
    const numberOfStars = 150; // more stars for bigger scroll area

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

    // Make sure container height covers the entire scroll height
    container.style.height = `${pageHeight}px`;

    hasGeneratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasGeneratedRef.current) {
      requestAnimationFrame(generateStars);
    }

    const onResizeOrScrollHeightChange = () => {
      hasGeneratedRef.current = false;
      requestAnimationFrame(generateStars);
    };

    const observer = new ResizeObserver(onResizeOrScrollHeightChange);
    observer.observe(document.body);

    window.addEventListener('resize', onResizeOrScrollHeightChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResizeOrScrollHeightChange);
    };
  }, [generateStars]);

  return (
    <div
      id="star-background"
      ref={containerRef}
      className="absolute top-0 left-0 w-full -z-10 overflow-hidden pointer-events-none bg-[#0B1120]"
    />
  );
};
