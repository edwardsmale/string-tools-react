import React from 'react';
import './ExplainWindow.scss';

const ExplainWindow: React.FC = () => (
  <div 
    className="string-tools__textarea explain-window"
    placeholder="An explanation of your instructions will be shown here">
    <textarea className="string-tools__textarea explain-window"></textarea>
  </div>
);

export default ExplainWindow;
