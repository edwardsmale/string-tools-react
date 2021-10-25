import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import Scrollbar from '../Scrollbar/Scrollbar';
import './InputPane.scss';
import {TextSelection} from '../../interfaces/TextSelection';

interface InputPaneProps {
  onFocus: () => void;
  hasFocus: boolean;
  keyDownEventHandlers: ((event: KeyboardEvent) => void)[];
  removeInputPaneText: (lines: string[], textSelection: TextSelection) => void;
  getInputPaneText: (lines: string[], textSelection: TextSelection) => string;
  setInputPaneLines: (lines: string[]) => void;
  insertInputPaneText: (lines: string[], charIndex: number, lineIndex: number, textToInsert: string) => void;
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
  textSelection: TextSelection | null;
}

class InputPane extends React.Component<InputPaneProps, InputPaneState> {

  constructor(props: InputPaneProps) {
    super(props)

    this.state = {
      scrollX: 0,
      scrollY: 0,
      caretCharIndex: -1,
      caretLineIndex: -1,
      textSelection: null
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

    let scrolledSelection: TextSelection | null = null;

    if (this.state.textSelection !== null) {

      scrolledSelection = { 
        startChar: this.state.textSelection.startChar - this.state.scrollX,
        startLine: this.state.textSelection.startLine - this.state.scrollY,
        stopChar: this.state.textSelection.stopChar - this.state.scrollX,
        stopLine: this.state.textSelection.stopLine - this.state.scrollY
      }
    }

    for (let lineIndex = 0; lineIndex < visibleLines.length; lineIndex++) {

      const isLineSelected = 
        scrolledSelection !== null &&
        lineIndex > scrolledSelection.startLine && 
        lineIndex < scrolledSelection.stopLine;

      const visibleChars = visibleLines[lineIndex].substring(startCharIndex, stopCharIndex);

      let charElements: JSX.Element[] = [];

      let isCharSelected = false;

      // Highlight partially-selected lines by adding a CSS class to individual chars.
      // Highlight fully-selected lines by adding a CSS class to the lines.

      // If the selection spans multiple lines, and this is the last line, highlight
      // chars until the stop char index.
      
      if (scrolledSelection !== null &&
          scrolledSelection.stopLine !== scrolledSelection.startLine &&
          lineIndex === scrolledSelection.stopLine) {
        
        isCharSelected = true;
      }

      for (let charIndex = 0; charIndex < visibleChars.length; charIndex++) {

        // If reached the selection start line and char, start highlighting chars.
        if (scrolledSelection !== null &&
            lineIndex === scrolledSelection.startLine && 
            charIndex === scrolledSelection?.startChar) {
          
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
        if (scrolledSelection !== null &&
            lineIndex === scrolledSelection.stopLine &&
            charIndex === scrolledSelection.stopChar) {

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

    this.setState({ textSelection: null });
  }

  updateSelectionState(charIndex: number, lineIndex: number) : void {

    if (this.mouseDownCharIndex !== -1 && this.mouseDownLineIndex !== -1) {

      if (this.mouseDownCharIndex !== charIndex || this.mouseDownLineIndex !== lineIndex) {

        let selection: TextSelection = {
          startChar: this.mouseDownCharIndex,
          startLine: this.mouseDownLineIndex,
          stopChar: charIndex,
          stopLine: lineIndex
        };

        if (this.mouseDownLineIndex > lineIndex || 
           (this.mouseDownLineIndex === lineIndex && this.mouseDownCharIndex > charIndex)) {

          // Swap them around if the user has highlighted backwards.

          selection = {
            startChar: selection.stopChar,
            startLine: selection.stopLine,
            stopChar: selection.startChar,
            stopLine: selection.startLine
          }
        }

        this.setState({ textSelection: selection });
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

  handleKeyDown(event: KeyboardEvent) : void {

    if (!this.props.hasFocus) {
      return;
    }

    if (event.ctrlKey || event.key.length === 1) {
      event.preventDefault();
    }

    let linesWithSelectedTextRemoved = this.props.lines;

    let charIndex = this.state.caretCharIndex + 1;
    let lineIndex = this.state.caretLineIndex;

    let changed = false;

    // If text is selected, modify charIndex, and create linesWithSelectedTextRemoved.
    if (this.state.textSelection !== null) {

      charIndex = this.state.textSelection.startChar;
      lineIndex = this.state.textSelection.startLine;

      linesWithSelectedTextRemoved = this.props.textUtilsService.RemoveSubText(
        this.props.lines,
        this.state.textSelection
      );
    }

    if (event.ctrlKey === true) {

      if (event.key === "a") {

        // Select all

        this.mouseDownCharIndex = 0;
        this.mouseDownLineIndex = 0;

        this.updateSelectionState(
          this.props.lines[this.props.lines.length - 1].length, 
          this.props.lines.length
        );
      }
      else if (event.key === "c" && this.state.textSelection !== null) {

        // Copy

        const copiedText = this.props.getInputPaneText(
          this.props.lines,
          this.state.textSelection
        );

        navigator.clipboard.writeText(copiedText);
      }
      else if (event.key === "x" && this.state.textSelection !== null) {

        // Cut

        const cutText = this.props.getInputPaneText(
          this.props.lines,
          this.state.textSelection
        );

        navigator.clipboard.writeText(cutText);

        this.props.removeInputPaneText(
          this.props.lines,
          this.state.textSelection
        );

        changed = true;
      }
      else
      {
        if (event.key === "v") {

          // Paste

          navigator.clipboard.readText().then((pasteText) => {

            pasteText = this.props.textUtilsService.RemoveTrailing(pasteText, "\n");

            this.props.insertInputPaneText(
              linesWithSelectedTextRemoved,
              charIndex,
              lineIndex,
              pasteText
            );

            const lines = this.props.textUtilsService.TextToLines(pasteText);
            const lastLine = lines[lines.length - 1];

            charIndex = lines.length === 1 ? charIndex + lastLine.length : lastLine.length;
            lineIndex = lineIndex + lines.length - 1;

            // We have to do the setState and clearSelection here as we're inside a callback.

            this.setState({
              caretCharIndex: charIndex - 1,
              caretLineIndex: lineIndex,
            });
        
            this.clearSelection();
          });
        }
      }
    }
    else if (event.key === "Enter") {

      this.props.insertInputPaneText(
        linesWithSelectedTextRemoved,
        charIndex,
        lineIndex,
        "\n"
      );

      charIndex = 0;
      lineIndex++;

      changed = true;
    }
    else if (event.key === "Backspace") {

      if (this.state.textSelection !== null) {

        this.props.setInputPaneLines(linesWithSelectedTextRemoved);
      } 
      else {

        this.props.removeInputPaneText(
          this.props.lines, { 
            startChar: this.state.caretCharIndex,
            startLine: this.state.caretLineIndex,
            stopChar: this.state.caretCharIndex,
            stopLine: this.state.caretLineIndex
          }
        );

        charIndex--;
      }

      changed = true;
    }
    else if (event.key === "Delete") {

      if (this.state.textSelection !== null) {

        this.props.setInputPaneLines(linesWithSelectedTextRemoved);
      } 
      else {

        this.props.removeInputPaneText(
          this.props.lines, { 
            startChar: this.state.caretCharIndex + 1,
            startLine: this.state.caretLineIndex,
            stopChar: this.state.caretCharIndex + 1,
            stopLine: this.state.caretLineIndex
          }
        );
      }

      changed = true;
    }
    else if (event.key.length === 1) {

      // A letter, number of symbol key has been pressed.

      this.props.insertInputPaneText(
        linesWithSelectedTextRemoved,
        charIndex,
        lineIndex,
        event.key
      );

      charIndex++;

      changed = true;
    }

    this.setState({
      caretCharIndex: charIndex - 1,
      caretLineIndex: lineIndex,
    });

    if (changed) {
      this.clearSelection();
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
            overflow: "hidden",
            flexGrow: 1
          }}>
          <div className="input-pane__textarea textarea" 
               onMouseDown={(event) => { this.handleMouseDown(event, 0, 0); }}
               onMouseUp={(event) => { this.handleMouseUp(event, 0, 0); }}>
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
