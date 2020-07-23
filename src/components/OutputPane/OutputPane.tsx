import React from 'react';
import './OutputPane.scss';

class OutputPane extends React.Component {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="pane pane--right">
        <textarea 
          className="string-tools__textarea pane-textarea" 
          placeholder="Output will appear here"></textarea>
      </div>
    );
  }
}

export default OutputPane;
