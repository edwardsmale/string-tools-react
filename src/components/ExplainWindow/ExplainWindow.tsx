import React from 'react';
import './ExplainWindow.scss';

interface ExplainWindowProps {
    explanation: string;
}

interface ExplainWindowState {
  
}

class ExplainWindow extends React.Component<ExplainWindowProps, ExplainWindowState> {

  render() {
    return (
      <div 
        className="explain-window"
        placeholder="An explanation of your instructions will be shown here">
        <textarea className="string-tools__textarea" value={this.props.explanation}></textarea>
      </div>
    );
  }
}

export default ExplainWindow;
