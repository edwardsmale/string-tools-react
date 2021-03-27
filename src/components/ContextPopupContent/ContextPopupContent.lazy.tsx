import React, { lazy, Suspense } from 'react';

const LazyContextPopupContent = lazy(() => import('./ContextPopupContent'));

const ContextPopupContent = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyContextPopupContent {...props} />
  </Suspense>
);

export default ContextPopupContent;
