import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import './OutputPane.scss';

interface OutputPaneProps {
  output: string;
  textUtilsService: TextUtilsService;
}

interface OutputPaneState {

}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  constructor(props: OutputPaneProps) {
    super(props)

    this.textUtilsService = props.textUtilsService;

    this.getOverlayValue = this.getOverlayValue.bind(this);
  }

  private textUtilsService: TextUtilsService;

  getOverlayValue(codeValue: string) {

    let codeLines = this.textUtilsService.TextToLines(codeValue);

    let overlayLines = [];

    for (let i = 0; i < codeLines.length; i++) {

      let line = codeLines[i];
      
      overlayLines.push(line);
    }

    return overlayLines.join("\n");
  }

  render() {
    return (
      <div className="output-pane pane pane--right">
        <textarea
          className="string-tools__textarea pane-textarea"
          placeholder="Output will appear here"
          value={this.props.output}
          readOnly></textarea>
        <textarea 
          className="output-pane__overlay textarea-overlay string-tools__textarea window-textarea"
          spellCheck={false}
          value={this.getOverlayValue(this.props.output)}
          readOnly={true}></textarea>
      </div>
    );
  }
}

export default OutputPane;
