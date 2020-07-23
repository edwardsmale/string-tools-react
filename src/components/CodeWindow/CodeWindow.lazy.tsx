import React, { lazy, Suspense } from 'react';

const LazyCodeWindow = lazy(() => import('./CodeWindow'));

const CodeWindow = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCodeWindow {...props} />
  </Suspense>
);

export default CodeWindow;
