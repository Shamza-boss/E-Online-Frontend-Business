# Developer Quick Reference: Performance Optimizations

> Target stack: Next.js 16.0.3 + React 19.2.x

## How to Use Optimized Components

### 1. Using Lazy-Loaded PDFViewer

```tsx
// OLD (heavy initial bundle)
import PDFViewer from '@/app/_lib/components/PDFViewer/PDFViewer';

// NEW (lazy-loaded, optimized)
import PDFViewer from '@/app/_lib/components/PDFViewer';

// Usage remains the same
<PDFViewer fileUrl={url} initialPage={1} />;
```

### 2. Using Lazy-Loaded TipTap Editor

```tsx
// OLD
import Editor from '@/app/_lib/components/TipTapEditor/Editor';

// NEW (with loading state)
import Editor from '@/app/_lib/components/TipTapEditor';

// Usage remains the same
<Editor note={note} loading={loading} onSave={handleSave} />;
```

### 3. Component Memoization Pattern

```tsx
import { memo, useCallback } from 'react';

function MyComponent({ data, onAction }) {
  // Memoize callbacks to prevent child re-renders
  const handleAction = useCallback(() => {
    onAction(data);
  }, [data, onAction]);

  return (
    // component JSX
  );
}

// Export memoized version
export default memo(MyComponent);
```

### 4. Optimized SWR Usage

```tsx
import useSWR from 'swr';
import { swrConfig } from '@/app/_lib/config/swr';

function MyComponent() {
  const { data, error, isLoading } = useSWR(
    'my-key',
    fetcherFunction,
    swrConfig // Use optimized config
  );

  // Component logic
}
```

### 5. Dynamic Import Pattern

```tsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

## Performance Best Practices

### ✅ DO

- Use `React.memo` for components that receive stable props
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive calculations
- Lazy load heavy dependencies (PDF, charts, editors)
- Keep components small and focused (Single Responsibility)
- Use proper TypeScript types for better tree-shaking

### ❌ DON'T

- Create inline functions in JSX props
- Create new objects/arrays in render
- Use `any` type (prevents optimizations)
- Import entire libraries when you only need specific functions
- Create unnecessary wrapper components

## Code Examples

### Memoized Event Handler

```tsx
// ❌ BAD: Creates new function on every render
<Button onClick={() => handleClick(item)}>Click</Button>;

// ✅ GOOD: Memoized callback
const handleClick = useCallback(() => {
  doSomething(item);
}, [item]);

<Button onClick={handleClick}>Click</Button>;
```

### Memoized Computation

```tsx
// ❌ BAD: Recalculates on every render
const filtered = items.filter((item) => item.active);

// ✅ GOOD: Only recalculates when items change
const filtered = useMemo(() => items.filter((item) => item.active), [items]);
```

### Conditional Rendering

```tsx
// ✅ GOOD: Suspense boundary for async component
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>

// ✅ GOOD: Conditional prop for showing/hiding
<Dialog open={isOpen} onClose={handleClose}>
  {content}
</Dialog>
```

## Performance Checklist

Before pushing code, verify:

- [ ] No console.logs in production code (auto-removed)
- [ ] Heavy components are lazy-loaded
- [ ] Event handlers are memoized
- [ ] Expensive calculations use useMemo
- [ ] Lists have proper `key` props
- [ ] Images use Next.js Image component
- [ ] No unused imports
- [ ] No duplicate dependencies

## Testing Performance

### Development Mode

```bash
# Run with turbopack
npm run dev

# Check bundle size impact
npm run build
```

### Production Testing

```bash
npm run build
npm run start
```

### Lighthouse Audit

1. Build production version
2. Start production server
3. Open Chrome DevTools
4. Run Lighthouse audit
5. Aim for 90+ score

## Common Performance Issues

### Issue: Component Re-renders Too Often

**Solution**: Add `React.memo` and check dependencies in hooks

### Issue: Large Bundle Size

**Solution**:

- Check for duplicate dependencies
- Use dynamic imports
- Enable tree-shaking with proper imports

### Issue: Slow Initial Load

**Solution**:

- Lazy load non-critical components
- Optimize images
- Check network waterfall in DevTools

### Issue: Slow Navigation

**Solution**:

- Use Next.js Link component
- Prefetch critical routes
- Optimize page data fetching

## Quick Wins

1. **Add loading states**: Prevents layout shift
2. **Use Suspense**: Better loading UX
3. **Memoize everything**: Prevents re-renders
4. **Optimize images**: Use WebP/AVIF
5. **Lazy load modals**: Load when opened
6. **Debounce inputs**: Reduce re-renders
7. **Virtual scrolling**: For long lists

## Resources

- [Next.js Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
