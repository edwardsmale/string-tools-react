import React from 'react';
import './ExplainWindow.scss';

class ExplainWindow extends React.Component {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div 
        className="string-tools__textarea explain-window"
        placeholder="An explanation of your instructions will be shown here">
        <textarea className="string-tools__textarea explain-window"></textarea>
      </div>
    );
  }
}

export default ExplainWindow;
