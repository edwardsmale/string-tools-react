import React, { lazy, Suspense } from 'react';

const LazyInputPane = lazy(() => import('./InputPane'));

const InputPane = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyInputPane {...props} />
  </Suspense>
);

export default InputPane;
