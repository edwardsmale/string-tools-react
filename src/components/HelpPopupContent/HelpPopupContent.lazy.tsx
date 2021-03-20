import React, { lazy, Suspense } from 'react';

const LazyHelpPopupContent = lazy(() => import('./HelpPopupContent'));

const HelpPopupContent = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyHelpPopupContent {...props} />
  </Suspense>
);

export default HelpPopupContent;
