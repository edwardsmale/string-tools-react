import React, { lazy, Suspense } from 'react';

const LazyPopup = lazy(() => import('./Popup'));

const Popup = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyPopup {...props} />
  </Suspense>
);

export default Popup;
