import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component that triggers smooth entrance animations on scroll down & scroll up.
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up', // 'fade-up' | 'slide-left' | 'slide-right' | 'zoom-in' | 'bounce'
  delay = 0,
  className = '',
  once = false,
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
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'translate-y-0 translate-x-0 scale-100 opacity-100';
    }

    switch (animation) {
      case 'fade-up':
        return 'translate-y-10 opacity-0';
      case 'slide-left':
        return '-translate-x-12 opacity-0';
      case 'slide-right':
        return 'translate-x-12 opacity-0';
      case 'zoom-in':
        return 'scale-90 opacity-0';
      case 'bounce':
        return 'translate-y-12 opacity-0';
      default:
        return 'translate-y-10 opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transform-gpu transition-all duration-700 ease-out will-change-[transform,opacity] ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
