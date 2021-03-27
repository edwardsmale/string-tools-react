import React from 'react';
import ReactDOM from 'react-dom';
import ContextPopupContent from './ContextPopupContent';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ContextPopupContent />, div);
  ReactDOM.unmountComponentAtNode(div);
});