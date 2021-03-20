import React from 'react';
import ReactDOM from 'react-dom';
import HelpPopupContent from './HelpPopupContent';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HelpPopupContent />, div);
  ReactDOM.unmountComponentAtNode(div);
});