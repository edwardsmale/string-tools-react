import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import VerticalScrollbar from '../VerticalScrollbar/VerticalScrollbar';
import './OutputPane.scss';

interface OutputPaneProps {
  output: string[][];
  height: number;
  lineHeight: number;
  textUtilsService: TextUtilsService
}

interface OutputPaneState {
  scrollLine: number;
}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  constructor(props: OutputPaneProps) {
    super(props)

    this.state = {
      scrollLine: 0
    }

    this.escapedNewlineRegex = new RegExp(String.fromCharCode(0), "g");

    this.textUtilsService = props.textUtilsService;

    this.getOutputLineCount = this.getOutputLineCount.bind(this);
    this.getVisibleElements = this.getVisibleElements.bind(this);
    this.getNumberOfVisibleLines = this.getNumberOfVisibleLines.bind(this);
    this.getLengthOfVerticalScrollbar = this.getLengthOfVerticalScrollbar.bind(this);
    this.getPositionOfVerticalScrollbar = this.getPositionOfVerticalScrollbar.bind(this);

    this.downArrowClick = this.downArrowClick.bind(this);
    this.upArrowClick = this.upArrowClick.bind(this);

    this.downGutterClick = this.downGutterClick.bind(this);
    this.upGutterClick = this.upGutterClick.bind(this);
  }

  private textUtilsService: TextUtilsService;

  private escapedNewlineRegex: RegExp;

  getOutputLineCount(): number {

    let count = 0;

    for (let i = 0; i < this.props.output.length; i++) {

      count += this.props.output[i].length;
    }

    return count;
  }

  getVisibleElements(value: string[][]): JSX.Element[] {

    let output: JSX.Element[] = [];

    let count = 0;

    let stopLine = this.state.scrollLine + this.getNumberOfVisibleLines();

    for (let i = 0; i < value.length; i++) {

      if (count + value[i].length < this.state.scrollLine) {

        count += value[i].length;
      }
      else {

        for (let j = 0; j < value[i].length; j++) {

          if (count >= this.state.scrollLine) {

            const text = value[i][j]
              .replace(/\\n/g, "\n")
              .replace(this.escapedNewlineRegex, "\\n")
              .replace(/\n$/, "\n\n");

            output.push(<div key={`${Math.random()}`}>{text}</div>);
          }

          count++;

          if (count >= stopLine) {

            return output;
          }
        }
      }
    }

    return output;
  }

  getNumberOfVisibleLines() {

    return this.props.height / this.props.lineHeight;
  }

  getLengthOfVerticalScrollbar() {

    return 100.0 * this.getNumberOfVisibleLines() / this.getOutputLineCount();
  }

  getPositionOfVerticalScrollbar() {

    return 100.0 * this.state.scrollLine / this.getOutputLineCount();
  }

  upArrowClick() {

    if (this.state.scrollLine > 0) {
      this.setState({ scrollLine: this.state.scrollLine - 1 });
    }
  }

  downArrowClick() {

    if (this.state.scrollLine + 1 < this.getOutputLineCount()) {
      this.setState({ scrollLine: this.state.scrollLine + 1 });
    }
  }

  upGutterClick() {

    if (this.state.scrollLine > 0) {
      this.setState({ scrollLine: this.state.scrollLine - 20 });
    }
  }

  downGutterClick() {

    if (this.state.scrollLine + 20 < this.getOutputLineCount()) {
      this.setState({ scrollLine: this.state.scrollLine + 20 });
    }
  }

  render() {
    return (
      <div className="output-pane pane pane--right" style={{ height: this.props.height + "rem" }}>
        <div className="output-pane__value textarea">
          {this.getVisibleElements(this.props.output)}
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
}

export default OutputPane;
