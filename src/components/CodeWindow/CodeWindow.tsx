import React from 'react';
import './CodeWindow.scss';

const CodeWindow: React.FC = () => (
  <div
    className="string-tools__textarea code-window"
    placeholder="Enter your instructions here">
    <textarea className="string-tools__textarea code-window" defaultValue={`split ,
sort 3,2
csv \t`}></textarea>
  </div>
);

export default CodeWindow;
