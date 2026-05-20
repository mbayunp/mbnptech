import { useEffect, useRef, ReactNode } from 'react';
import Lenis from '@studio-freight/lenis';

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Inisialisasi Lenis dengan konfigurasi scroll premium (buttery smooth)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Out-expo easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Integrasi Request Animation Frame
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;
