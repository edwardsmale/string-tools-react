import React from 'react';
import ReactDOM from 'react-dom';
import OutputPane from './OutputPane';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<OutputPane />, div);
  ReactDOM.unmountComponentAtNode(div);
});