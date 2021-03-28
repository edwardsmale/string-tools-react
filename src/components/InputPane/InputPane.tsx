import React from 'react';
import './InputPane.scss';

interface InputPaneProps {
  value: string;
  onInput(input: string): any;
}

interface InputPaneState {
}

class InputPane extends React.Component<InputPaneProps, InputPaneState> {

  constructor(props: InputPaneProps) {
    super(props)

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
   
    this.props.onInput(
      event.target.value
    );
  }

  render () {  
    return (
      <div className="pane pane--left input-pane">
        <textarea
          className="textarea pane-textarea"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder="Paste the text to process in here"
          onChange={this.handleChange}
          value={this.props.value}
        ></textarea>
      </div>
    );
  }
};

export default InputPane;
