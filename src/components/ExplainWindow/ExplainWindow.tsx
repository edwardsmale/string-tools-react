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
      <div key={`${Math.random()}`}>
        {lines.map((line) => (
          <div key={`${Math.random()}`} className="explain-window__text-item">{line}</div>
        ))}
      </div>
    );

    return (
      <div key={`${Math.random()}`} className="explain-window">
        <div key={`${Math.random()}`} className="textarea">{elements}</div>
      </div>
    );
  }
}

export default ExplainWindow;
