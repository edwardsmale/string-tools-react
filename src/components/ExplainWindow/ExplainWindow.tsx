import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import './ExplainWindow.scss';

interface ExplainWindowProps {
  explanation: string;
  onFocus: () => void;
  hasFocus: boolean;
  textUtilsService: TextUtilsService;
}

interface ExplainWindowState {
}

class ExplainWindow extends React.Component<ExplainWindowProps, ExplainWindowState> {

  constructor(props: ExplainWindowProps) {
    super(props)

    this.textUtilsService = props.textUtilsService;

    this.handleMouseDown = this.handleMouseDown.bind(this);
  }

  private inc:number = 0;

  nextNumber() {
    if (this.inc === 2147483647) {
      this.inc = 0;
    }
    else {
      this.inc++;
    }

    return this.inc; 
  }

  private textUtilsService: TextUtilsService;

  handleMouseDown(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) : void {

    event.stopPropagation();

    this.props.onFocus();
  }

  render() {

    const lines = this.textUtilsService.TextToLines(this.props.explanation);

    return (
      <div className={"explain-window textarea " + (this.props.hasFocus ? "explain-window--focussed" : "")}
           onMouseDown={(event) => { this.handleMouseDown(event); }}>
          {lines.map((line) => (
            <div key={`e${this.nextNumber()}`}>{line}</div>
          ))}
      </div>
    );
  }
}

export default ExplainWindow;
