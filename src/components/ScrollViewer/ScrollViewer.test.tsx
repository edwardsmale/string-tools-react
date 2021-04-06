import React from 'react';
import ReactDOM from 'react-dom';
import ScrollViewer from './ScrollViewer';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ScrollViewer />, div);
  ReactDOM.unmountComponentAtNode(div);
});