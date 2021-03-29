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
  private cachedOutput: JSX.Element | null;

  private escapedNewlineRegex: RegExp;

  getOutputValue(value: string[][]) {

    let hash = 0;

    let needReplace = false;

    let i = 0;
    let j = 0;

    while (i < value.length && !needReplace) {

      if (value[i][j]) {

        for (let k = 0; k < value[i][j].length; k++) {

          const charCode = value[i][j].charCodeAt(k);

          hash = (hash << 5) - hash + charCode;

          needReplace = needReplace || charCode === 0;
        }

        needReplace = needReplace || (value[i][j].includes("\\n") || value[i][j].endsWith("\n"));
      }

      if (++j >= value[i].length) {

        j = 0;
        i++;
      }
    }

    while (i < value.length) {

      if (value[i][j]) {

        for (let k = 0; k < value[i][j].length; k++) {

          hash = (hash << 5) - hash + value[i][j].charCodeAt(k);
        }
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

            current.push(<div key={j}>{text}</div>);
        }

        output.push(<div key={i}>{current}</div>)
      }

      this.cachedOutput = <div key={hash}>{output}</div>;
  
      return this.cachedOutput;
    }
    else {

      this.cachedOutput = (
        <div key={hash}>
          {value.map((value_i, i) => <div key={i}>
            {value_i.map((value_j, j) => <div key={j}>{value_j}</div>)}
          </div>)}
        </div>
      );
  
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
