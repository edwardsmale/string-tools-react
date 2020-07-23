import React from 'react';
import './OutputPane.scss';

const OutputPane: React.FC = () => (
  <div className="pane pane--right">
    <textarea 
      className="string-tools__textarea pane-textarea" 
      placeholder="Output will appear here"></textarea>
  </div>
);

export default OutputPane;
