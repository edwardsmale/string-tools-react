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

  private cachedValue: string;
  private cachedOutputElement: JSX.Element;

  getOutputValue(value: string[][]) {

    let output = [];

    let alt = 0;

    const classNames = [
      "output-pane__text-group--dark",
      "output-pane__text-group--light"
    ];

    let concat = "";

    for (let i = 0; i < value.length; i++) {

      concat += value[i].join("");
    }

    if (concat === this.cachedValue) {

      return this.cachedOutputElement;
    }

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

          const text = value[i][j]
            .replace(/\\n/g, "\n")
            .replace(new RegExp(String.fromCharCode(0), "g"), "\\n")
            .replace(/\n$/, "\n\n");

          output.push(
            <div className={`${classNames[alt]}`}>{text}</div>
          )
      }

      alt = 1 - alt;
    }

    this.cachedOutputElement = (
      <div key={concat}>
        {output}
      </div>
    );

    this.cachedValue = concat;

    return this.cachedOutputElement;
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
      <div className="output-pane pane pane--right output-pane__value textarea">
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
    );
  }
}

export default OutputPane;
