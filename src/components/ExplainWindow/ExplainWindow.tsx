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
      <div className="explain-window">
        <textarea
          className="string-tools__textarea window-textarea"
          placeholder="An explanation of your instructions will be shown here"
          value={this.props.explanation}
          readOnly></textarea>
      </div>
    );
  }
}

export default ExplainWindow;
