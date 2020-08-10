import React from 'react';
import './InputPane.scss';
import { Recoverable } from 'repl';

interface InputPaneProps {
  input: string;
}

interface InputPaneState {

}

class InputPane extends React.Component<InputPaneProps, InputPaneState> {

  constructor(props: InputPaneProps) {
    super(props)
  }

  render () {
  
    return (
      <div className="pane pane--left">
        <textarea className="string-tools__textarea pane-textarea"
                  placeholder="Paste the text to process in here"
        >{this.props.input}</textarea>
      </div>
    );
  }
};

export default InputPane;
