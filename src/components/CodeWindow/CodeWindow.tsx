import React from 'react';
import './CodeWindow.scss';

interface CodeWindowProps {
  onInput(input: string): any;    
}

interface CodeWindowState {
  value: string;
}

class CodeWindow extends React.Component<CodeWindowProps, CodeWindowState> {

  constructor(props: CodeWindowProps) {
    super(props)

    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    this.setState({
      value: event.target.value}
    );
    
    this.props.onInput(
      event.target.value
    );
  }

  render() {
    return (
    <div className="code-window"
         placeholder="Enter your instructions here">
      <textarea
        className="string-tools__textarea window-textarea"
        value={this.state.value}
        onChange={this.handleChange}></textarea>
    </div>
    );
  }  
}
export default CodeWindow;
