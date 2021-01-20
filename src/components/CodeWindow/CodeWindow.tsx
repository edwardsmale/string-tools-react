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
    this.props.onInput(
      event.target.value
    );
  }

  render() {
    return (
      <div className="code-window">
        <textarea
          className="string-tools__textarea window-textarea"
          placeholder="Enter your instructions here"
          spellCheck={false}
          onChange={this.handleChange}
          value={this.props.value}
        ></textarea>
      </div>
    );
  }  
}
export default CodeWindow;
