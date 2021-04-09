import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import Scrollbar from '../Scrollbar/Scrollbar';
import './InputPane.scss';

interface InputPaneProps {
  lines: string[];
  hash: number;
  width: number;
  charWidth: number;
  height: number;
  lineHeight: number;
  isMouseDown: boolean;
  mouseX: number;
  mouseY: number;
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

    this.getVisibleWidth = this.getVisibleWidth.bind(this);
    this.getContentWidth = this.getContentWidth.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.getVisibleHeight = this.getVisibleHeight.bind(this);

    this.getVisibleElements = this.getVisibleElements.bind(this);
  }

  private lastGeneratedContentWidthHash: number | undefined;

  private lastGeneratedContentWidth: number | undefined;

  getVisibleWidth() { return this.props.width / this.props.charWidth; }

  getContentWidth() { 

    if (this.props.hash === this.lastGeneratedContentWidthHash && this.lastGeneratedContentWidth !== undefined) {

      return this.lastGeneratedContentWidth;
    }

    let widest = 0;

    for (let i = 0; i < Math.min(this.props.lines.length, 100000); i++) {

      if (this.props.lines[i].length > widest) {

        widest = this.props.lines[i].length;
      }
    }

    this.lastGeneratedContentWidth = widest;
    this.lastGeneratedContentWidthHash = this.props.hash;

    return widest;
  }

  getVisibleHeight() { return this.props.height / this.props.lineHeight; }

  getContentHeight() { return this.props.lines.length; }

  getVisibleElements() {

    const aX = this.state.scrollX;
    const bX = this.state.scrollX + this.getVisibleWidth();

    const aY = this.state.scrollY;
    const bY = this.state.scrollY + this.getVisibleHeight();

    return this.props.lines
      .slice(aY, bY)
      .map(line => { return <div key={`${Math.random()}`}>{line.substring(aX, bX)}</div>; })
  }

  render () {  
    return (
      <div
        className="input-pane pane pane--left" 
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
          <div className="input-pane__textarea textarea">
            {this.getVisibleElements()}
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
};

export default InputPane;
