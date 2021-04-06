import React, { lazy, Suspense } from 'react';

const LazyScrollViewer = lazy(() => import('./ScrollViewer'));

const ScrollViewer = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyScrollViewer {...props} />
  </Suspense>
);

export default ScrollViewer;
