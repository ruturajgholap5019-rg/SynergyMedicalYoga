import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component that triggers smooth entrance animations
 * (text sliding up, images scaling up, buttons moving into view)
 * whenever elements scroll into the user's viewport.
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up', // 'fade-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'bounce'
  delay = 0,
  className = '',
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'translate-y-0 translate-x-0 scale-100 opacity-100';
    }

    switch (animation) {
      case 'fade-up':
        return 'translate-y-12 opacity-0';
      case 'slide-left':
        return '-translate-x-16 opacity-0';
      case 'slide-right':
        return 'translate-x-16 opacity-0';
      case 'zoom-in':
        return 'scale-90 opacity-0';
      case 'bounce':
        return 'translate-y-16 opacity-0';
      default:
        return 'translate-y-12 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
