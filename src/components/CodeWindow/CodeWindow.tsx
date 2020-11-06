import React from 'react';
import './CodeWindow.scss';

interface CodeWindowProps {
  value: string;
  onInput(input: string): any;
}

interface CodeWindowState {
}

class CodeWindow extends React.Component<CodeWindowProps, CodeWindowState> {

  constructor(props: CodeWindowProps) {
    super(props)

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    this.props.onInput(event.target.value);
  }

  render() {
    return (
    <div className="code-window"
         placeholder="Enter your instructions here">
      <textarea
        className="string-tools__textarea window-textarea"
        onChange={this.handleChange}></textarea>
        value={this.props.value}
    </div>
    );
  }  
}
export default CodeWindow;
