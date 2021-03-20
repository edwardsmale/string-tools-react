import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import './ExplainWindow.scss';

interface ExplainWindowProps {
  explanation: string;
  textUtilsService: TextUtilsService;
}

interface ExplainWindowState {

}

class ExplainWindow extends React.Component<ExplainWindowProps, ExplainWindowState> {

  constructor(props: ExplainWindowProps) {
    super(props)

    this.textUtilsService = props.textUtilsService;
  }

  private textUtilsService: TextUtilsService;

  render() {

    let lines = this.textUtilsService.TextToLines(this.props.explanation);

    let elements = (
      <div key={`${Math.random()}`} className="explain-Popup__text-group textarea__text-group">
        {lines.map((line) => (
          <div key={`${Math.random()}`} className="explain-Popup__text-item textarea__text-item">{line}</div>
        ))}
      </div>
    );

    return (
      <div key={`${Math.random()}`} className="explain-window">
        <div key={`${Math.random()}`} className="explain-Popup__textarea string-tools__textarea window-textarea textarea" 
             style={ { overflow: "hidden" } }
             >{elements}</div>
      </div>
    );
  }
}

export default ExplainWindow;
