import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import './CodeWindow.scss';

interface CodeWindowProps {
  value: string;
  onInput(input: string): any;
  onSelect(event: any): any;
  textUtilsService: TextUtilsService;
}

interface CodeWindowState {
}

class CodeWindow extends React.Component<CodeWindowProps, CodeWindowState> {

  constructor(props: CodeWindowProps) {
    super(props)

    this.textUtilsService = props.textUtilsService;

    this.handleChange = this.handleChange.bind(this);
    this.getOverlayValue = this.getOverlayValue.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  private textUtilsService: TextUtilsService;

  handleChange(event: any) {
    this.props.onInput(
      event.target.value
    );
  }

  handleSelect(event: any) {
    this.props.onSelect(
      event.target.value
    );
  }

  getOverlayValue(codeValue: string) {

    let codeLines = this.textUtilsService.TextToLines(codeValue);

    let overlayLines = [];

    for (let i = 0; i < codeLines.length; i++) {

      let line = codeLines[i];

      if (line.indexOf(" ") === -1) {
        overlayLines.push(line);
      }
      else {
        let command = line.substring(0, line.indexOf(" "));
        let paras = line.substring(command.length + 1);

        paras = paras.replace(/\s/gm, "▪")

        let updatedLine = command + " " + paras.replace(/[^\s▪]/gm, " ");

        overlayLines.push(updatedLine);
      }
    }

    return overlayLines.join("\n");
  }

  render() {
    return (
      <div className="code-window">
        <textarea
          className="textarea js-code-window-textarea"
          placeholder="Enter your instructions here"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          value={this.props.value}
        ></textarea>
        <textarea 
          className="code-window__overlay textarea-overlay textarea"
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          value={this.getOverlayValue(this.props.value)}
          readOnly={true}></textarea>
      </div>
    );
  }  
}
export default CodeWindow;
