import React from 'react';
import ReactDOM from 'react-dom';
import Window from './Window';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Window />, div);
  ReactDOM.unmountComponentAtNode(div);
});