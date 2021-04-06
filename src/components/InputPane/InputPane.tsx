import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import VerticalScrollbar from '../VerticalScrollbar/VerticalScrollbar';
import './InputPane.scss';

interface InputPaneProps {
  lines: string[];
  width: number;
  charWidth: number;
  height: number;
  lineHeight: number;
  textUtilsService: TextUtilsService;
}

interface InputPaneState {
  scrollX: number;
  scrollY: number;
}

class InputPane extends React.Component<InputPaneProps, InputPaneState> {

  constructor(props: InputPaneProps) {
    super(props)

    this.state = {
      scrollX: 0,
      scrollY: 0
    }

    this.getVisibleElements = this.getVisibleElements.bind(this);
    this.getWidthInChars = this.getWidthInChars.bind(this);
    this.getHeightInLines = this.getHeightInLines.bind(this);
    this.getLengthOfVerticalScrollbar = this.getLengthOfVerticalScrollbar.bind(this);
    this.getPositionOfVerticalScrollbar = this.getPositionOfVerticalScrollbar.bind(this);

    this.downArrowClick = this.downArrowClick.bind(this);
    this.upArrowClick = this.upArrowClick.bind(this);

    this.downGutterClick = this.downGutterClick.bind(this);
    this.upGutterClick = this.upGutterClick.bind(this);
  }

  getVisibleElements() {

    const a = this.state.scrollX;
    const b = this.state.scrollX + this.getWidthInChars();

    return this.props.lines
      .slice(this.state.scrollY, this.state.scrollY + this.getHeightInLines())
      .map(line => { return <div key={`${Math.random()}`}>{line.substring(a, b)}</div>; })
  }

  getWidthInChars() {

    return this.props.width / this.props.charWidth;
  }

  getHeightInLines() {

    return this.props.height / this.props.lineHeight;
  }

  getLengthOfVerticalScrollbar() {

    return 100.0 * this.getHeightInLines() / this.props.lines.length;
  }

  getPositionOfVerticalScrollbar() {

    return 100.0 * this.state.scrollY / this.props.lines.length;
  }

  upArrowClick() {

    if (this.state.scrollY > 0) {
      this.setState({ scrollY: this.state.scrollY - 1 });
    }
  }

  downArrowClick() {

    if (this.state.scrollY + 1 < this.props.lines.length) {
      this.setState({ scrollY: this.state.scrollY + 1 });
    }
  }

  upGutterClick() {

    if (this.state.scrollY > 0) {
      this.setState({ scrollY: this.state.scrollY - 20 });
    }
  }

  downGutterClick() {

    if (this.state.scrollY + 20 < this.props.lines.length) {
      this.setState({ scrollY: this.state.scrollY + 20 });
    }
  }

  render () {  
    return (
      <div
        className="input-pane pane pane--left" 
        style={{ 
          width: this.props.width + "rem", 
          height: this.props.height + "rem"
        }}>
        <div className="input-pane__textarea">
          <div className="textarea">{this.getVisibleElements()}</div>
        </div>
        <VerticalScrollbar 
          onUpArrowClick={this.upArrowClick}
          onDownArrowClick={this.downArrowClick}
          onUpGutterClick={this.upGutterClick}
          onDownGutterClick={this.downGutterClick}
          barPositionPercentage={this.getPositionOfVerticalScrollbar()}
          barLengthPercentage={this.getLengthOfVerticalScrollbar()}
        ></VerticalScrollbar>
      </div>
    );
  }
};

export default InputPane;
