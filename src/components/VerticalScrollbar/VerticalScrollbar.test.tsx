import React from 'react';
import ReactDOM from 'react-dom';
import VerticalScrollbar from './VerticalScrollbar';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<VerticalScrollbar />, div);
  ReactDOM.unmountComponentAtNode(div);
});