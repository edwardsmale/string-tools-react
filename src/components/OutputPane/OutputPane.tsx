import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import './OutputPane.scss';

interface OutputPaneProps {
  output: string[][];
  textUtilsService: TextUtilsService
}

interface OutputPaneState {

}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  constructor(props: OutputPaneProps) {
    super(props)

    this.textUtilsService = props.textUtilsService;

    this.getOutputValue = this.getOutputValue.bind(this);
  }

  private textUtilsService: TextUtilsService;

  getOutputValue(value: string[][]) {

    let output = [];

    let alt = false;

    for (let i = 0; i < value.length; i++) {

      const className = (alt ? "output-pane__text-group--light" : "output-pane__text-group--dark");

      for (let j = 0; j < value[i].length; j++) {

          const text = value[i][j]
            .replace(/\\n/g, "\n")
            .replace(new RegExp(String.fromCharCode(0), "g"), "\\n")
            .replace(/\n$/, "\n\n");

          output.push(
            <div key={`${Math.random()}`} className={`${className}`}>{text}</div>
          )
      }

      alt = !alt;
    }
  
    return output;
  }

  render() {
    return (
      <div className="output-pane pane pane--right">
        <div
          className="output-pane__value string-tools__textarea pane-textarea"
          >{this.getOutputValue(this.props.output)}</div>
      </div>
    );
  }
}

export default OutputPane;
