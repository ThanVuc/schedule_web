'use client';

import { useEffect, useRef } from 'react';
import './bgLayout.scss';

export const StarBackground = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.querySelectorAll(".star").forEach((el) => el.remove());

    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.className = "star";

      const size = Math.random() * 2 + 1 + "px";
      const top = Math.random() * 100 + "%";
      const left = Math.random() * 100 + "%";
      const duration = 3 + Math.random() * 3 + "s";
      const delay = Math.random() * 5 + "s";

      star.style.width = size;
      star.style.height = size;
      star.style.top = top;
      star.style.left = left;
      star.style.animationDuration = duration;
      star.style.animationDelay = delay;

      container.appendChild(star);
    }
  }, []);

  return (
    <div className="star-background relative overflow-hidden min-h-screen w-[100%]" ref={containerRef}>
      {children}
    </div>
  );
};
