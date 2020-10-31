import React from 'react';
import './OutputPane.scss';

interface OutputPaneProps {
  output: string;
}

interface OutputPaneState {

}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  constructor(props: OutputPaneProps) {
    super(props);
  }

  render() {
    return (
      <div className="pane pane--right">
        <textarea 
          className="string-tools__textarea pane-textarea" 
          placeholder="Output will appear here"
          value={this.props.output}></textarea>
      </div>
    );
  }
}

export default OutputPane;
