// Performance monitoring utility for Next.js
export function reportWebVitals(metric: any) {
  // Log to console in development, send to analytics in production
  const { name, value, id, label } = metric;
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${name}:`, {
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      id,
      label,
    });
  }
}

// Utility to measure component render time
export function measureComponentRender(componentName: string) {
  if (typeof performance === 'undefined') return () => {};

  const startMark = `${componentName}-render-start`;
  const endMark = `${componentName}-render-end`;
  const measureName = `${componentName}-render`;

  performance.mark(startMark);

  return () => {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);

    const measure = performance.getEntriesByName(measureName)[0];
    if (measure && process.env.NODE_ENV === 'development') {
      console.log(
        `[Performance] ${componentName} rendered in ${Math.round(measure.duration)}ms`
      );
    }

    // Clean up marks and measures
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(measureName);
  };
}
