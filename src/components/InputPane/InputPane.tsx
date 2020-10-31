import React from 'react';
import './InputPane.scss';

interface InputPaneProps {
  onInput(input: string): any;
}

interface InputPaneState {
  value: string;
}

class InputPane extends React.Component<InputPaneProps, InputPaneState> {

  constructor(props: InputPaneProps) {
    super(props)

    this.state = {
      value: `1,W11111,Edward,Smale,Leighton Buzzard
1,W11112,Edward,Smale,Sheffield
2,W22222,Stephen,Smale,Sheffield
3,W33333,Jo,Smale,Roehampton
4,W44444,Jo,Burton,Barnes
5,W55555,Edward,Burton,London`
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    this.setState({
      value: event.target.value
    });
    
    this.props.onInput(
      event.target.value
    );
  }

  render () {
  
    return (
      <div className="pane pane--left">
        <textarea className="string-tools__textarea pane-textarea"
                  placeholder="Paste the text to process in here"
                  value={this.state.value}
                  onChange={this.handleChange}
        ></textarea>
      </div>
    );
  }
};

export default InputPane;
