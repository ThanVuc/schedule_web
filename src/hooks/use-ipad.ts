import * as React from "react";

const IPAD_MIN_WIDTH = 768;
const IPAD_MAX_WIDTH = 1024;

export function useIsIpad() {
  const [isIpad, setIsIpad] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${IPAD_MIN_WIDTH}px) and (max-width: ${IPAD_MAX_WIDTH}px)`);

    const onChange = (event: MediaQueryListEvent) => {
      setIsIpad(event.matches);
    };

    // Initial check
    setIsIpad(window.innerWidth >= IPAD_MIN_WIDTH && window.innerWidth <= IPAD_MAX_WIDTH);

    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isIpad;
}
