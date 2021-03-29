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

    this.escapedNewlineRegex = new RegExp(String.fromCharCode(0), "g");

    this.textUtilsService = props.textUtilsService;

    this.getOutputValue = this.getOutputValue.bind(this);
  }

  private textUtilsService: TextUtilsService;

  private cachedHash: number;
  private cachedOutput: JSX.Element[] | null;

  private escapedNewlineRegex: RegExp;

  getOutputValue(value: string[][]) {

    let hash = 0;

    let needReplace = false;

    let i = 0;
    let j = 0;

    while (i < value.length && !needReplace) {

      const line = value[i][j] || String.fromCharCode(10);

      for (let k = 0; k < line.length; k++) {

        const charCode = line.charCodeAt(k);

        hash  = ((hash << 5) - hash) + charCode;
        hash |= 0; // Convert to 32bit integer

        needReplace = needReplace || charCode === 0;
      }

      needReplace = needReplace || (line.includes("\\n") || line.endsWith("\n"));

      if (++j >= value[i].length) {

        j = 0;
        i++;
      }
    }

    while (i < value.length) {

      const line = value[i][j] || String.fromCharCode(10);

      for (let k = 0; k < line.length; k++) {

        hash  = ((hash << 5) - hash) + line.charCodeAt(k);
        hash |= 0; // Convert to 32bit integer
      }

      if (++j >= value[i].length) {

        j = 0;
        i++;
      }
    }

    if (this.cachedOutput && hash === this.cachedHash) {

      return this.cachedOutput;
    }
  
    this.cachedHash = hash;

    if (needReplace) {

      let output = [];

      for (let i = 0; i < value.length; i++) {

        let current = [];

        for (let j = 0; j < value[i].length; j++) {

            const text = value[i][j]
              .replace(/\\n/g, "\n")
              .replace(this.escapedNewlineRegex, "\\n")
              .replace(/\n$/, "\n\n");

            current.push(<div key={`${Math.random()}`}>{text}</div>);
        }

        output.push(<div key={`${Math.random()}`}>{current}</div>)
      }

      this.cachedOutput = output;
  
      return this.cachedOutput;
    }
    else {

      this.cachedOutput = value.map((value_i, i) => 
          <div key={`${Math.random()}`}>{value_i.map((value_j, j) =>
              <div key={`${Math.random()}`}>{value_j}</div>
            )}
          </div>);
  
      return this.cachedOutput;
    }
  }

  getOverlayValue(value: string[][]) : string {

    let output = "";

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

          const text = value[i][j]
            .replace(/\\n/g, "\n")
            .replace(this.escapedNewlineRegex, "\\n");

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
