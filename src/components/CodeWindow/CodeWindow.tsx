import React from 'react';
import './CodeWindow.scss';

interface CodeWindowProps {
    code: string;
}

interface CodeWindowState {
  
}

class CodeWindow extends React.Component<CodeWindowProps, CodeWindowState> {

  constructor(props: CodeWindowProps) {
    super(props)
  }

  render() {
    return (
    <div
      className="string-tools__textarea code-window"
      placeholder="Enter your instructions here">
      <textarea
        className="string-tools__textarea code-window"
        value={this.props.code}></textarea>
    </div>
    );
  }  
}
export default CodeWindow;
