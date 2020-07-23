import React, { lazy, Suspense } from 'react';

const LazyExplainWindow = lazy(() => import('./ExplainWindow'));

const ExplainWindow = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyExplainWindow {...props} />
  </Suspense>
);

export default ExplainWindow;
