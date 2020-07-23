import React from 'react';
import ReactDOM from 'react-dom';
import CodeWindow from './CodeWindow';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CodeWindow />, div);
  ReactDOM.unmountComponentAtNode(div);
});