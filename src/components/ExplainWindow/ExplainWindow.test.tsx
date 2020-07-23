import React from 'react';
import ReactDOM from 'react-dom';
import ExplainWindow from './ExplainWindow';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ExplainWindow />, div);
  ReactDOM.unmountComponentAtNode(div);
});