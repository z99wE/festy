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
  const [shouldMount, setShouldMount] = useState(() => typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldMount || !containerRef.current || typeof IntersectionObserver === 'undefined') return;
    const onIntersect: IntersectionObserverCallback = ([entry]) => {
      if (!entry?.isIntersecting) return;
      setShouldMount(true);
      observer.disconnect();
    };
    const observer = new IntersectionObserver(onIntersect, { rootMargin });
    observer.observe(containerRef.current);
    const timeoutId = setTimeout(() => setShouldMount(true), idleDelayMs);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [rootMargin, idleDelayMs, shouldMount]);

  const wrapperStyle = {
    minHeight: shouldMount ? undefined : placeholderHeight,
    width: '100%',
  };

  return (
    <div ref={containerRef} style={wrapperStyle}>
      {shouldMount ? children : null}
    </div>
  );
};
