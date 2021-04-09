import React from 'react';
import { start } from 'repl';
import Scrollbar from '../Scrollbar/Scrollbar';
import './OutputPane.scss';

interface OutputPaneProps {
  output: string[][];
  hash: number;
  width: number;
  charWidth: number;
  height: number;
  lineHeight: number;
  isMouseDown: boolean;
  mouseX: number;
  mouseY: number;
}

interface OutputPaneState {
  scrollX: number;
  scrollY: number;
}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  constructor(props: OutputPaneProps) {
    super(props)

    this.state = {
      scrollX: 0,
      scrollY: 0
    }

    this.escapedNewlineRegex = new RegExp(String.fromCharCode(0), "g");

    this.getVisibleWidth = this.getVisibleWidth.bind(this);
    this.getContentWidth = this.getContentWidth.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.getVisibleHeight = this.getVisibleHeight.bind(this);

    this.getVisibleElements = this.getVisibleElements.bind(this);
  }

  private lastGeneratedContentWidthHash: number | undefined;
  private lastGeneratedContentHeightHash: number | undefined;

  private lastGeneratedContentWidth: number | undefined;
  private lastGeneratedContentHeight: number | undefined;

  private escapedNewlineRegex: RegExp;

  getVisibleWidth() { return this.props.width / this.props.charWidth; }

  getContentWidth() { 

    if (this.props.hash === this.lastGeneratedContentWidthHash && this.lastGeneratedContentWidth !== undefined) {

      return this.lastGeneratedContentWidth;
    }

    let widest = 0;

    for (let i = 0; i < Math.min(20, this.props.output.length); i++) {

      for (let j = 0; j < this.props.output[i].length; j++) {

        if (this.props.output[i][j].length > widest) {

          widest = this.props.output[i][j].length;
        }
      }
    }

    this.lastGeneratedContentWidth = widest;
    this.lastGeneratedContentWidthHash = this.props.hash;

    return widest;
  }  

  getVisibleHeight() { return this.props.height / this.props.lineHeight; }

  getContentHeight(): number {

    if (this.props.hash === this.lastGeneratedContentHeightHash && this.lastGeneratedContentHeight !== undefined) {

      return this.lastGeneratedContentHeight;
    }

    let count = 0;

    for (let i = 0; i < this.props.output.length; i++) {

      count += this.props.output[i].length;
    }

    this.lastGeneratedContentHeight = count;
    this.lastGeneratedContentHeightHash = this.props.hash;

    return count;
  }

  private lastGeneratedVisibleElementsHash: number | undefined = undefined;
  private lastGeneratedVisibleElementsStartLine: number | undefined = undefined;
  private lastGeneratedVisibleElementsStopLine: number | undefined = undefined;
  private lastGeneratedVisibleElements: JSX.Element[] | undefined = undefined;

  getVisibleElements(value: string[][]): JSX.Element[] {

    const startLine = this.state.scrollY;
    const stopLine = this.state.scrollY + this.getVisibleHeight();

    if (this.props.hash === this.lastGeneratedVisibleElementsHash &&
        startLine === this.lastGeneratedVisibleElementsStartLine &&
        stopLine === this.lastGeneratedVisibleElementsStopLine &&
         this.lastGeneratedVisibleElements !== undefined) {

      return this.lastGeneratedVisibleElements;
    }    

    let output: JSX.Element[] = [];

    let count = 0;

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

        if (count >= startLine) {

          const text = value[i][j]
            .replace(/\\n/g, "\n")
            .replace(this.escapedNewlineRegex, "\\n")
            .replace(/\n$/, "\n\n");

          output.push(<div key={`${Math.random()}`}>{text}</div>);
        }

        count++;

        if (count >= stopLine) {
          break;
        }
      }

      if (count >= stopLine) {
        break;
      }
    }

    this.lastGeneratedVisibleElementsHash = this.props.hash;
    this.lastGeneratedVisibleElementsStartLine = startLine;
    this.lastGeneratedVisibleElementsStopLine = stopLine;
    this.lastGeneratedVisibleElements = output;

    return output;
  }

  render() {
    return (
      <div className="output-pane pane pane--right"
           style={{ 
             width: this.props.width + "rem",
             height: this.props.height + "rem",
             flexDirection: "column"
            }}>
        <div style={{ 
            display: "flex",
            flexDirection: "row",
            overflow: "hidden"
          }}>
          <div className="output-pane__value textarea">
            {this.getVisibleElements(this.props.output)}
          </div>
          <Scrollbar
            isVertical={true}
            isMouseDown={this.props.isMouseDown}
            mousePos={this.props.mouseY}
            contentLength={this.getContentHeight()}
            visibleLength={this.getVisibleHeight()}
            getScrollPosition={() => { return this.state.scrollY; }}
            setScrollPosition={(scrollPosition: number) => this.setState({ scrollY: scrollPosition })}
          ></Scrollbar>
        </div>  
        <Scrollbar 
          isVertical={false}
          isMouseDown={this.props.isMouseDown}
          mousePos={this.props.mouseX}
          contentLength={this.getContentWidth()}
          visibleLength={this.getVisibleWidth()}
          getScrollPosition={() => { return this.state.scrollX; }}
          setScrollPosition={(scrollPosition: number) => this.setState({ scrollX: scrollPosition })}
        ></Scrollbar> 
      </div>
    );
  }
}

export default OutputPane;
