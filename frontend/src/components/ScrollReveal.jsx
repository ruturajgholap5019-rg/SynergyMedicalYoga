import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component that smoothly reveals content when scrolled into view.
 * Ensures text is always visible and never hidden once revealed.
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Safety fallback: ensure content becomes visible within 400ms under all conditions
    const safetyTimer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(safetyTimer);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    observer.observe(node);

    return () => {
      clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, []);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'translate-y-0 translate-x-0 scale-100 opacity-100';
    }

    switch (animation) {
      case 'fade-up':
        return 'translate-y-6 opacity-0';
      case 'slide-left':
        return '-translate-x-8 opacity-0';
      case 'slide-right':
        return 'translate-x-8 opacity-0';
      case 'zoom-in':
        return 'scale-95 opacity-0';
      default:
        return 'translate-y-6 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-500 ease-out ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
