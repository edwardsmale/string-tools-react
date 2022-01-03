import React from 'react';
import { Services } from '../../services/services';
import './CodeWindow.scss';

interface CodeWindowProps {
  value: string;
  onInput(input: string): any;
  onSelect(event: any): any;
  onFocus: () => void;
  hasFocus: boolean;
  services: Services;
}

interface CodeWindowState {
}

class CodeWindow extends React.Component<CodeWindowProps, CodeWindowState> {

  constructor(props: CodeWindowProps) {
    super(props)

    this.textUtilsService = this.props.services.text;

    this.handleChange = this.handleChange.bind(this);
    this.getOverlayValue = this.getOverlayValue.bind(this);
    this.handleSelect = this.handleSelect.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

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

    let codeLines = this.props.services.text.TextToLines(codeValue);

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

  handleMouseDown(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) : void {

    event.stopPropagation();

    this.props.onFocus();
  }

  render() {
    return (
      <div className={"code-window " + (this.props.hasFocus ? "code-window--focussed" : "")}
           onMouseDown={(event) => { this.handleMouseDown(event); }}>
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
