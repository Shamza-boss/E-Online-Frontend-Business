import { useEffect } from 'react';

export default function useResizeSync(dependency: any) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100); // Delay ensures the layout has updated first
    return () => clearTimeout(timeout);
  }, [dependency]);
}
