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
        <textarea 
          className="code-window__overlay string-tools__textarea window-textarea"
          spellCheck={false}
          value={this.props.value.replace(/^ {1}/gm, "▪").replace(/ {2}/g, " ▪",).replace(/▪ {1}/g, "▪▪",).replace(/[^▪\r\n]/g, " ").replace(/ {1}$/gm, "▪")}
          readOnly={true}></textarea>
      </div>
    );
  }  
}
export default CodeWindow;
