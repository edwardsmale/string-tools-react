import React, { lazy, Suspense } from 'react';

const LazyScrollbar = lazy(() => import('./Scrollbar'));

const Scrollbar = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyScrollbar {...props} />
  </Suspense>
);

export default Scrollbar;
