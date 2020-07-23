import React from 'react';
import ReactDOM from 'react-dom';
import InputPane from './InputPane';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<InputPane />, div);
  ReactDOM.unmountComponentAtNode(div);
});