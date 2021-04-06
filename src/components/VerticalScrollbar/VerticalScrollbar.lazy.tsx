import React, { lazy, Suspense } from 'react';

const LazyVerticalScrollbar = lazy(() => import('./VerticalScrollbar'));

const VerticalScrollbar = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyVerticalScrollbar {...props} />
  </Suspense>
);

export default VerticalScrollbar;
