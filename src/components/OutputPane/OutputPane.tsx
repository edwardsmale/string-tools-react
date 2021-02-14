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

      let array = value[i];

      let curr = [];
  
      for (let j = 0; j < array.length; j++) {

          let lines = array[j].split(/\\n/);

          let ele = (
            <div key={`${Math.random()}`} className="output-pane__text-group textarea__text-group">
              {lines.map((line) => (
                <div key={`${Math.random()}`} className="output-pane__text-item textarea__text-item">{line}</div>
              ))}
            </div>
          );

          curr.push(ele);
      }

      let className = "output-pane__text-item " + (alt ? "output-pane__text-item--light" : "output-pane__text-item--dark");

      alt = !alt;

      output.push(
        <div key={`${Math.random()}`} className={`${className}`}>
        {curr.map((item) => (
          item
        ))}
        </div>
      )
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
