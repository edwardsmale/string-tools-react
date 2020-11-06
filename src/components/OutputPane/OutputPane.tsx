import React from 'react';
import './OutputPane.scss';

interface OutputPaneProps {
  output: string;
}

interface OutputPaneState {

}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  render() {
    return (
      <div className="pane pane--right">
        <textarea
          className="string-tools__textarea pane-textarea"
          placeholder="Output will appear here"
          value={this.props.output}
          readOnly></textarea>
      </div>
    );
  }
}

export default OutputPane;
