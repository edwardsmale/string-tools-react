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

    const lines = this.textUtilsService.TextToLines(this.props.explanation);

    return (
      <div className="explain-window textarea">
          {lines.map((line) => (
            <div key={`${Math.random()}`}>{line}</div>
          ))}
      </div>
    );
  }
}

export default ExplainWindow;
