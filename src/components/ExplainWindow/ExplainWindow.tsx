import React from 'react';
import { Explanation } from '../../interfaces/CommandInterfaces';
import './ExplainWindow.scss';

interface ExplainWindowProps {
  explanation: Explanation[];
  onFocus: () => void;
  hasFocus: boolean;
}

interface ExplainWindowState {
}

class ExplainWindow extends React.Component<ExplainWindowProps, ExplainWindowState> {

  constructor(props: ExplainWindowProps) {
    super(props)

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

  handleMouseDown(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) : void {

    event.stopPropagation();

    this.props.onFocus();
  }

  render() {

    return (
      <div className={"explain-window textarea " + (this.props.hasFocus ? "explain-window--focussed" : "")}
           onMouseDown={(event) => { this.handleMouseDown(event); }}>

         {this.props.explanation.map((line) => (
            <div key={`e${this.nextNumber()}`}
                 className="explain-window__line">{line.segments.map((segment) => (
              <span className="explain-window__segment">{segment}</span>
            ))}</div>
          ))}
      </div>
    );
  }
}

export default ExplainWindow;
