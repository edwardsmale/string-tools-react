import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import './OutputPane.scss';

interface OutputPaneProps {
  output: string[][];
  textUtilsService: TextUtilsService;
}

interface OutputPaneState {

}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  constructor(props: OutputPaneProps) {
    super(props)

    this.textUtilsService = props.textUtilsService;

    this.getOutputValue = this.getOutputValue.bind(this);
    this.getOverlayValue = this.getOverlayValue.bind(this);
  }

  private textUtilsService: TextUtilsService;

  getOutputValue(value: string[][]) {

    let outputLines = [];

    for (let i = 0; i < value.length; i++) {

      let array = value[i];

      for (let j = 0; j < array.length; j++) {

        outputLines.push(array[j]);
      }
    }

    return outputLines.join("\n");
  }

  overlayHasDividingLines = (value: string[][]) => value.some((elem) => elem.length > 1);

  getOverlayValue(value: string[][]) {

    let overlayLines = [];

    let showDividingLines = this.overlayHasDividingLines(value);

    if (showDividingLines) {

      let dividingLine = "̶  ".repeat(20);

      overlayLines.push(dividingLine);

      for (let i = 0; i < value.length; i++) {

        let array = value[i];

        for (let j = 0; j < array.length - 1; j++) {

          overlayLines.push("");
        }

        overlayLines.push(dividingLine);
      }
    }

    return overlayLines.join("\n");
  }

  render() {
    return (
      <div className={`output-pane pane pane--right ${this.overlayHasDividingLines(this.props.output) && "output-pane--has-dividing-lines"}`}>
        <textarea
          className="output-pane__value string-tools__textarea pane-textarea"
          placeholder="Output will appear here"
          value={this.getOutputValue(this.props.output)}
          readOnly></textarea>
        <textarea 
          className="output-pane__overlay textarea-overlay string-tools__textarea pane-textarea"
          spellCheck={false}
          value={this.getOverlayValue(this.props.output)}
          readOnly={true}></textarea>
      </div>
    );
  }
}

export default OutputPane;
