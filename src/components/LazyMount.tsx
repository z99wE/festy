import React, { useState, useEffect, useRef } from 'react';

interface LazyMountProps {
  children: React.ReactNode;
  placeholderHeight?: number | string;
  rootMargin?: string;
  idleDelayMs?: number;
}

export const LazyMount: React.FC<LazyMountProps> = ({
  children,
  placeholderHeight = '380px',
  rootMargin = '400px',
  idleDelayMs = 3500,
}) => {
  const [shouldMount, setShouldMount] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldMount) return;
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setShouldMount(true);
            observer.disconnect();
          }
        },
        { rootMargin }
      );
      observer.observe(el);

      const timeoutId = setTimeout(() => {
        setShouldMount(true);
      }, idleDelayMs);

      return () => {
        observer.disconnect();
        clearTimeout(timeoutId);
      };
    } else {
      setShouldMount(true);
    }
  }, [rootMargin, idleDelayMs, shouldMount]);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: shouldMount ? undefined : placeholderHeight,
        width: '100%',
      }}
    >
      {shouldMount ? children : null}
    </div>
  );
};
