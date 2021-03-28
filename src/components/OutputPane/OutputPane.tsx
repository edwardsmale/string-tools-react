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

  getOverlayValue(value: string[][]) : string {

    let output = "";

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

          const text = value[i][j]
            .replace(/\\n/g, "\n")
            .replace(new RegExp(String.fromCharCode(0), "g"), "\\n");

          output += text + "\n";
      }
    }
  
    return output;
  }

  noop() : void { }

  render() {
    return (
      <div className="output-pane pane pane--right">
        <div
          className="output-pane__value textarea pane-textarea">
            <textarea 
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="output-pane__overlay textarea"
              onChange={this.noop}
              value={this.getOverlayValue(this.props.output)}></textarea>
            {this.getOutputValue(this.props.output)}
          </div>
      </div>
    );
  }
}

export default OutputPane;
