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

    this.cachedHash = 0;
    this.cachedOutput = null;

    this.textUtilsService = props.textUtilsService;

    this.getOutputValue = this.getOutputValue.bind(this);
  }

  private textUtilsService: TextUtilsService;

  private cachedHash: number;
  private cachedOutput: JSX.Element | null;

  getOutputValue(value: string[][]) {

    let hash = 0;

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

        for (let k = 0; k < value[i][j].length; k++) {

          hash = (hash << 5) - hash + value[i][j].charCodeAt(k);
          hash &= hash;
        }
      }
    }

    if (this.cachedOutput && hash === this.cachedHash) {

      return this.cachedOutput;
    }

    let output = [];

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

          const text = value[i][j]
            .replace(/\\n/g, "\n")
            .replace(new RegExp(String.fromCharCode(0), "g"), "\\n")
            .replace(/\n$/, "\n\n");

          output.push(<div>{text}</div>);
      }
    }

    this.cachedOutput = <div key={hash}>{output}</div>;

    this.cachedHash = hash;

    return this.cachedOutput;
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
