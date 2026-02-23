import { useEffect, useRef, useState } from "react";

interface LazyLoadProps {
  children: React.ReactNode;
}

const LazyLoad = ({ children }: LazyLoadProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div
        className={`
          transition-all duration-700 ease-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        `}
      >
        {show ? children : <div className="h-40" />}
      </div>
    </div>
  );
};

export default LazyLoad;
