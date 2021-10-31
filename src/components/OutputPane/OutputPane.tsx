import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import Scrollbar from '../Scrollbar/Scrollbar';
import './OutputPane.scss';

interface OutputPaneProps {
  onFocus: () => void;
  hasFocus: boolean;
  keyDownEventHandlers: ((event: KeyboardEvent) => void)[];
  output: string[][];
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

interface OutputPaneState {
  scrollX: number;
  scrollY: number;
  caretCharIndex: number;
  caretLineIndex: number;
  selectionStartCharIndex: number;
  selectionStartLineIndex: number;
  selectionStopCharIndex: number;
  selectionStopLineIndex: number;
}

class OutputPane extends React.Component<OutputPaneProps, OutputPaneState> {

  constructor(props: OutputPaneProps) {
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

    this.escapedNewlineRegex = new RegExp(String.fromCharCode(0), "g");

    this.getVisibleWidth = this.getVisibleWidth.bind(this);
    this.getContentWidth = this.getContentWidth.bind(this);
    this.getContentHeight = this.getContentHeight.bind(this);
    this.getVisibleHeight = this.getVisibleHeight.bind(this);

    this.getVisibleElements = this.getVisibleElements.bind(this);
    this.getSelectedText = this.getSelectedText.bind(this);
    this.updateSelectionState = this.updateSelectionState.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.nextNumber = this.nextNumber.bind(this);
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

  componentDidMount() {

    this.props.keyDownEventHandlers.push(this.handleKeyDown);
  }

  private lastGeneratedContentWidthHash: number | undefined;
  private lastGeneratedContentHeightHash: number | undefined;

  private lastGeneratedContentWidth: number | undefined;
  private lastGeneratedContentHeight: number | undefined;

  private escapedNewlineRegex: RegExp;

  private scrollbarWidth = 0.875;

  getVisibleWidth() { return (this.props.width - this.scrollbarWidth) / this.props.charWidth; }

  getContentWidth() { 

    if (this.props.hash === this.lastGeneratedContentWidthHash && 
        this.lastGeneratedContentWidth !== undefined) {

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

    if (this.props.hash === this.lastGeneratedContentHeightHash && 
        this.lastGeneratedContentHeight !== undefined) {

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

  private lastGeneratedVisibleElementsCaretCharIndex: number | undefined = undefined;
  private lastGeneratedVisibleElementsCaretLineIndex: number | undefined = undefined;

  private lastGeneratedVisibleElementsSelectionStartCharIndex: number | undefined = undefined;
  private lastGeneratedVisibleElementsSelectionStartLineIndex: number | undefined = undefined;

  private lastGeneratedVisibleElementsSelectionStopCharIndex: number | undefined = undefined;
  private lastGeneratedVisibleElementsSelectionStopLineIndex: number | undefined = undefined;

  private lastGeneratedVisibleElements: JSX.Element[] | undefined = undefined;

  getVisibleElements(): JSX.Element[] {

    const value = this.props.output;

    const scrollX = this.state.scrollX;
    const scrollY = this.state.scrollY;

    const aX = scrollX;
    const bX = scrollX + this.getVisibleWidth();

    const aY = scrollY;
    const bY = scrollY + this.getVisibleHeight();

    const caretCharIndex = this.state.caretCharIndex - scrollX;
    const caretLineIndex = this.state.caretLineIndex - scrollY;

    const selectionStartCharIndex = this.state.selectionStartCharIndex - scrollX;
    const selectionStartLineIndex = this.state.selectionStartLineIndex - scrollY;

    const selectionStopCharIndex = this.state.selectionStopCharIndex - scrollX;
    const selectionStopLineIndex = this.state.selectionStopLineIndex - scrollY;

    if (this.props.hash === this.lastGeneratedVisibleElementsHash &&
        aY === this.lastGeneratedVisibleElementsStartLine &&
        bY === this.lastGeneratedVisibleElementsStopLine &&
        caretCharIndex === this.lastGeneratedVisibleElementsCaretCharIndex &&
        caretLineIndex === this.lastGeneratedVisibleElementsCaretLineIndex &&
        selectionStartCharIndex === this.lastGeneratedVisibleElementsSelectionStartCharIndex &&
        selectionStartLineIndex === this.lastGeneratedVisibleElementsSelectionStartLineIndex &&
        selectionStopCharIndex === this.lastGeneratedVisibleElementsSelectionStopCharIndex &&
        selectionStopLineIndex === this.lastGeneratedVisibleElementsSelectionStopLineIndex &&
        this.lastGeneratedVisibleElements !== undefined) {

      return this.lastGeneratedVisibleElements;
    }

    let lineElements: JSX.Element[] = [];

    let count = 0;

    let rowAlt = 0;
    
    const replaceTrailing = this.props.textUtilsService.ReplaceTrailing;

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

        if (count >= aY) {

          const lineIndex = lineElements.length;

          const isLineSelected = 
            lineIndex > selectionStartLineIndex && 
            lineIndex < selectionStopLineIndex;

          const text = replaceTrailing(
            value[i][j]
              .replace(/\\n/g, "\n")
              .replace(this.escapedNewlineRegex, "\\n"),
            "\n", 
            "\n\n"
          );
  
          const visibleChars = text.substring(aX, bX);
    
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

          for (let charIndex = 0; charIndex < text.length; charIndex++) {

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
                key={`o${this.nextNumber()}`} 
                className={
                  ("ch " +
                  (isCharCaret ? "crt " : " ") +  
                  (isCharSelected ? "chs ": " "))
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
              key={`${this.nextNumber()}`}     
              className={("ln" + rowAlt + " " + (isLineSelected ? "lns " : " "))}         
              onMouseDown={(event) => { this.handleMouseDown(event, text.length, lineIndex); }}
              onMouseMove={(event) => { this.handleMouseMove(event, text.length, lineIndex); }}
              onMouseUp={(event) => { this.handleMouseUp(event, text.length, lineIndex); }}
            >{charElements}</div>
          );
        }

        count++;

        if (count >= bY) {
          break;
        }
      }

      rowAlt = 1 - rowAlt;

      if (count >= bY) {
        break;
      }
    }

    this.lastGeneratedVisibleElementsHash = this.props.hash;
    this.lastGeneratedVisibleElementsStartLine = aY;
    this.lastGeneratedVisibleElementsStopLine = bY;
    this.lastGeneratedVisibleElementsCaretCharIndex = caretCharIndex;
    this.lastGeneratedVisibleElementsCaretLineIndex = caretLineIndex;
    this.lastGeneratedVisibleElementsSelectionStartCharIndex = selectionStartCharIndex;
    this.lastGeneratedVisibleElementsStartLine = selectionStartLineIndex;
    this.lastGeneratedVisibleElementsSelectionStopCharIndex = selectionStopCharIndex;
    this.lastGeneratedVisibleElementsStopLine = selectionStopLineIndex;
    this.lastGeneratedVisibleElements = lineElements;

    return lineElements;
  }

  mouseDownCharIndex: number = -1;
  mouseDownLineIndex: number = -1;

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

        this.setState({ 
          selectionStartCharIndex: -1,
          selectionStartLineIndex: -1,
          selectionStopCharIndex: -1,
          selectionStopLineIndex: -1
        });
      }
    }
  }

  getSelectedText(): string {
    
    const value = this.props.output;

    const startCharIndex = this.state.selectionStartCharIndex;
    const startLineIndex = this.state.selectionStartLineIndex;

    const stopCharIndex = this.state.selectionStopCharIndex;
    const stopLineIndex = this.state.selectionStopLineIndex;

    let lineCount = 0;
    let lines = [];

    for (let i = 0; i < value.length; i++) {

      for (let j = 0; j < value[i].length; j++) {

          if (lineCount === startLineIndex) {

            lines.push(value[i][j].substring(startCharIndex));
          }
          else if (lineCount > startLineIndex && lineCount < stopLineIndex) {

            lines.push(value[i][j]);
          }
          else if (lineCount === stopLineIndex) {

            lines.push(value[i][j].substring(0, stopCharIndex + 1));
          }

          lineCount++;
      }
    }

    return lines.join("\n");
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

  handleKeyDown(event: KeyboardEvent) : void {
    
    if (this.props.hasFocus) {

      if (event.ctrlKey === true) {

        if (event.key === "a") {
          
          event.preventDefault();

          this.mouseDownCharIndex = 0;
          this.mouseDownLineIndex = 0;

          this.updateSelectionState(999999, this.props.textUtilsService.CountLines2(this.props.output));
        }
        else if (event.key === "c") {

          event.preventDefault();

          navigator.clipboard.writeText(this.getSelectedText());
        }
      }
    }
  }

  render() {
    return (
      <div className={"output-pane pane pane--right " + (this.props.hasFocus ? "pane--focussed" : "")}
           style={{ flexDirection: "column" }}>
        <div style={{ 
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            flexGrow: 1
          }}>
          <div className="output-pane__value textarea">
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
}

export default OutputPane;