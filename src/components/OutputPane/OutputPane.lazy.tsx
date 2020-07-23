import React, { lazy, Suspense } from 'react';

const LazyOutputPane = lazy(() => import('./OutputPane'));

const OutputPane = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyOutputPane {...props} />
  </Suspense>
);

export default OutputPane;
