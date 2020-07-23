import React from 'react';
import './CodeWindow.scss';

class CodeWindow extends React.Component {

  constructor(props: any) {
    super(props)
    this.state = { text:
`split ,
sort 3,2
csv \t`
    };
  }

  render() {
    return (
    <div
      className="string-tools__textarea code-window"
      placeholder="Enter your instructions here">
      <textarea
        className="string-tools__textarea code-window"
        value={this.state.text}></textarea>
    </div>
    );
  }  
}
export default CodeWindow;
