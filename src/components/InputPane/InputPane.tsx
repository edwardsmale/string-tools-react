import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import Scrollbar from '../Scrollbar/Scrollbar';
import './InputPane.scss';

interface InputPaneProps {
  onFocus: () => void;
  hasFocus: boolean;
  keyDownEventHandlers: ((event: KeyboardEvent) => void)[];
  removeInputPaneText: (lines: string[], startCharIndex: number, startLineIndex: number, stopCharIndex: number, stopLineIndex: number) => void;
  getInputPaneText: (lines: string[], startCharIndex: number, startLineIndex: number, stopCharIndex: number, stopLineIndex: number) => string;
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
  caretCharIndex: number;
  caretLineIndex: number;
  selectionStartCharIndex: number;
  selectionStartLineIndex: number;
  selectionStopCharIndex: number;
  selectionStopLineIndex: number;
}

class InputPane extends React.Component<InputPaneProps, InputPaneState> {

  constructor(props: InputPaneProps) {
    super(props)

    this.state = {
      scrollX: 0,
      scrollY: 0,
      caretCharIndex: -1,
      caretLineIndex: -1,
      selectionStartCharIndex: -1,
      selectionStartLineIndex: -1,
      selectionStopCharIndex: -1,
      selectionStopLineIndex: -1
    }

    this.getVisibleWidth = this.getVisibleWidth.bind(this);
    this.getContentWidth = this.getContentWidth.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.getVisibleHeight = this.getVisibleHeight.bind(this);

    this.getVisibleElements = this.getVisibleElements.bind(this);

    this.updateSelectionState = this.updateSelectionState.bind(this);
    this.clearSelection = this.clearSelection.bind(this);

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {

    this.props.keyDownEventHandlers.push(this.handleKeyDown);
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

    const startCharIndex = this.state.scrollX;
    const stopCharIndex = this.state.scrollX + this.getVisibleWidth();

    const startLineIndex = this.state.scrollY;
    const stopLineIndex = this.state.scrollY + this.getVisibleHeight();

    const visibleLines = this.props.lines.slice(startLineIndex, stopLineIndex);

    let lineElements: JSX.Element[] = [];

    const caretCharIndex = this.state.caretCharIndex - this.state.scrollX;
    const caretLineIndex = this.state.caretLineIndex - this.state.scrollY;

    const selectionStartCharIndex = this.state.selectionStartCharIndex - this.state.scrollX;
    const selectionStartLineIndex = this.state.selectionStartLineIndex - this.state.scrollY;

    const selectionStopCharIndex = this.state.selectionStopCharIndex - this.state.scrollX;
    const selectionStopLineIndex = this.state.selectionStopLineIndex - this.state.scrollY;

    for (let lineIndex = 0; lineIndex < visibleLines.length; lineIndex++) {

      const isLineSelected = 
        lineIndex > selectionStartLineIndex && 
        lineIndex < selectionStopLineIndex;

      const visibleChars = visibleLines[lineIndex].substring(startCharIndex, stopCharIndex);

      let charElements: JSX.Element[] = [];

      let isCharSelected = false;

      // Highlight partially-selected lines by adding a CSS class to individual chars.
      // Highlight fully-selected lines by adding a CSS class to the lines.

      // If the selection spans multiple lines, and this is the last line, highlight
      // chars until the stop char index.
      
      if (selectionStopLineIndex !== selectionStartLineIndex &&
          lineIndex === selectionStopLineIndex) {
        
        isCharSelected = true;
      }

      for (let charIndex = 0; charIndex < visibleChars.length; charIndex++) {

        // If reached the selection start line and char, start highlighting chars.
        if (lineIndex === selectionStartLineIndex && 
            charIndex === selectionStartCharIndex) {
          
          isCharSelected = true;
        }

        let isCharCaret = 
          caretCharIndex === charIndex && 
          caretLineIndex === lineIndex;

        if (caretLineIndex === lineIndex &&
            caretCharIndex === visibleChars.length &&
            charIndex === visibleChars.length - 1) {
              isCharCaret = true;
        }

        charElements.push(
          <i 
            key={`${Math.random()}`} 
            className={
              ("ch " +
              (isCharCaret ? "crt " : " ") +  
              (isCharSelected ? "chs ": " ")).trim()
            }
            onMouseDown={(event) => { this.handleMouseDown(event, charIndex, lineIndex); }}
            onMouseMove={(event) => { this.handleMouseMove(event, charIndex, lineIndex); }}
            onMouseUp={(event) => { this.handleMouseUp(event, charIndex, lineIndex); }}
          >{visibleChars[charIndex]}</i>
        );

        // If past the selection stop line and char, stop highlighting chars.
        if (lineIndex === selectionStopLineIndex &&
            charIndex === selectionStopCharIndex) {

          isCharSelected = false;
        }
      }

      lineElements.push(
        <div 
          key={`${Math.random()}`} 
          className={("ln " + (isLineSelected ? "lns " : " ")).trim()}
          onMouseDown={(event) => { this.handleMouseDown(event, visibleChars.length, lineIndex); }}
          onMouseMove={(event) => { this.handleMouseMove(event, visibleChars.length, lineIndex); }}
          onMouseUp={(event) => { this.handleMouseUp(event, visibleChars.length, lineIndex); }}
          >{charElements}</div>
      );
    }

    return lineElements;
  }

  mouseDownCharIndex: number = -1;
  mouseDownLineIndex: number = -1;

  clearSelection() {    

    this.setState({ 
      selectionStartCharIndex: -1,
      selectionStartLineIndex: -1,
      selectionStopCharIndex: -1,
      selectionStopLineIndex: -1
    });
  }

  updateSelectionState(charIndex: number, lineIndex: number) : void {

    if (this.mouseDownCharIndex !== -1 && this.mouseDownLineIndex !== -1) {

      if (this.mouseDownCharIndex !== charIndex || this.mouseDownLineIndex !== lineIndex) {

        let startCharIndex = this.mouseDownCharIndex;
        let startLineIndex = this.mouseDownLineIndex;

        let stopCharIndex = charIndex;
        let stopLineIndex = lineIndex;

        if (this.mouseDownLineIndex > lineIndex || 
           (this.mouseDownLineIndex === lineIndex && this.mouseDownCharIndex > charIndex)) {

          // Swap them around if the user has highlighted backwards.

          startCharIndex = charIndex;
          startLineIndex = lineIndex;
    
          stopCharIndex = this.mouseDownCharIndex;
          stopLineIndex = this.mouseDownLineIndex;
        }

        this.setState({ 
          selectionStartCharIndex: startCharIndex,
          selectionStartLineIndex: startLineIndex,
          selectionStopCharIndex: stopCharIndex,
          selectionStopLineIndex: stopLineIndex
        });
      }
      else {

        this.clearSelection();
      }
    }
  }

  handleMouseDown(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, charIndex: number, lineIndex: number) : void {

    event.stopPropagation();

    charIndex += this.state.scrollX;
    lineIndex += this.state.scrollY;

    this.mouseDownCharIndex = charIndex;
    this.mouseDownLineIndex = lineIndex;

    this.props.onFocus();
  }

  handleMouseMove(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, charIndex: number, lineIndex: number) : void {

    event.stopPropagation();

    charIndex += this.state.scrollX;
    lineIndex += this.state.scrollY;

    // Prevent weird behaviour when the mouse button was released while the
    // mouse pointer was outside of the input pane, and therefore was not handled.
    if (event.buttons === 0) {

      this.mouseDownCharIndex = -1;
      this.mouseDownLineIndex = -1;
    }

    this.updateSelectionState(charIndex, lineIndex);
  }

  handleMouseUp(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, charIndex: number, lineIndex: number) : void {

    event.stopPropagation();

    charIndex += this.state.scrollX;
    lineIndex += this.state.scrollY;

    this.updateSelectionState(charIndex, lineIndex);

    this.mouseDownCharIndex = -1;
    this.mouseDownLineIndex = -1;

    this.setState({ 
      caretCharIndex: charIndex,
      caretLineIndex: lineIndex 
    });
  }

  clipboardText = "";

  handleKeyDown(event: KeyboardEvent) : void {

    if (this.props.hasFocus) {

      if (event.ctrlKey === true) {

        if (event.key === "a") {

          event.preventDefault();

          this.mouseDownCharIndex = 0;
          this.mouseDownLineIndex = 0;

          this.updateSelectionState(
            this.props.lines[this.props.lines.length - 1].length, 
            this.props.lines.length
          );
        }
        else if (event.key === "x") {

          event.preventDefault();

          this.clipboardText = this.props.getInputPaneText(
            this.props.lines,
            this.state.selectionStartCharIndex,
            this.state.selectionStartLineIndex,
            this.state.selectionStopCharIndex,
            this.state.selectionStopLineIndex
          );

          console.log(this.clipboardText);

          this.props.removeInputPaneText(
            this.props.lines,
            this.state.selectionStartCharIndex,
            this.state.selectionStartLineIndex,
            this.state.selectionStopCharIndex,
            this.state.selectionStopLineIndex
          );

          this.setState({
            caretCharIndex: this.state.selectionStartCharIndex - 1,
            caretLineIndex: this.state.selectionStartLineIndex
          })

          this.mouseDownCharIndex = -1;
          this.mouseDownLineIndex = -1;

          this.clearSelection();
        }
      }
    }
  }

  render () {  
    return (
      <div
        className={"input-pane pane pane--left " + (this.props.hasFocus ? "pane--focussed" : "")}
        tabIndex={0}
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
