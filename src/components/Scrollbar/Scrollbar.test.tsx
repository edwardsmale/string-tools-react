import React from 'react';
import ReactDOM from 'react-dom';
import Scrollbar from './Scrollbar';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Scrollbar />, div);
  ReactDOM.unmountComponentAtNode(div);
});