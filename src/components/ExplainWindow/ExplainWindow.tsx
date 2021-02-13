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

    let lines = this.textUtilsService.SplitIntoLines(this.props.explanation);

    let elements = (
      <div key={`${Math.random()}`} className="explain-window__text-group textarea__text-group">
        {lines.map((line) => (
          <div key={`${Math.random()}`} className="explain-window__text-item textarea__text-item">{line}</div>
        ))}
      </div>
    );

    return (
      <div className="explain-window">
        <div className="explain-window__textarea string-tools__textarea window-textarea textarea" 
             style={ { overflow: "hidden" } }
             >{elements}</div>
        {/* <textarea
          className="explain-window__textarea string-tools__textarea window-textarea"
          placeholder="An explanation of your instructions will be shown here"
          value={this.props.explanation}
          readOnly></textarea> */}
      </div>
    );
  }
}

export default ExplainWindow;
