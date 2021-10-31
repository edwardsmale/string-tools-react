import React from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import Scrollbar from '../Scrollbar/Scrollbar';
import './InputPane.scss';
import {TextRange} from '../../interfaces/TextRange';
import {TextPosition} from '../../interfaces/TextPosition';

interface InputPaneProps {
  onFocus: () => void;
  hasFocus: boolean;
  keyDownEventHandlers: ((event: KeyboardEvent) => void)[];
  removeInputPaneText: (lines: string[], textSelection: TextRange) => void;
  getInputPaneText: (lines: string[], textSelection: TextRange) => string;
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
  caretPos: TextPosition;
  textSelection: TextRange | null;
}

class InputPane extends React.Component<InputPaneProps, InputPaneState> {

  constructor(props: InputPaneProps) {
    super(props)

    this.state = {
      scrollX: 0,
      scrollY: 0,
      caretPos: { char: -1, line: 0 },
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
    this.handleArrowKey = this.handleArrowKey.bind(this);

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

  private lastGeneratedContentWidth: number | undefined;

  private scrollbarWidth = 0.875;

  getVisibleWidth() { return Math.round((this.props.width -  this.scrollbarWidth) / this.props.charWidth); }

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

  getVisibleHeight() { return Math.round(this.props.height / this.props.lineHeight); }

  getContentHeight() { return this.props.lines.length; }
  
  getVisibleElements() {

    const scrollX = this.state.scrollX;
    const scrollY = this.state.scrollY;

    const visibleRange: TextRange = {
      startChar: scrollX,
      startLine: scrollY,
      stopChar: Math.min(scrollX + this.getVisibleWidth(), this.getContentWidth()),
      stopLine: Math.min(scrollY + this.getVisibleHeight(), this.getContentHeight())
    }

    const visibleLinesLength = visibleRange.stopLine - visibleRange.startLine;

    let lineElements: JSX.Element[] = [];

    let scrolledSelection: TextRange | null = null;

    if (this.state.textSelection !== null) {

      scrolledSelection = { 
        startChar: this.state.textSelection.startChar - scrollX,
        startLine: this.state.textSelection.startLine - scrollY,
        stopChar: this.state.textSelection.stopChar - scrollX,
        stopLine: this.state.textSelection.stopLine - scrollY
      };
    }

    const scrolledCaretPosition = {
      char: this.state.caretPos.char,
      line: this.state.caretPos.line
    };

    for (let lineIndex = 0; lineIndex < visibleLinesLength; lineIndex++) {

      const isLineSelected = 
        scrolledSelection !== null &&
        lineIndex > scrolledSelection.startLine && 
        lineIndex < scrolledSelection.stopLine;

      const visibleCharsLength: number = visibleRange.stopChar - visibleRange.startChar;

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

      for (let charIndex = 0; charIndex < visibleCharsLength; charIndex++) {

        const pos: TextPosition = {
          char: charIndex,
          line: lineIndex 
        };

        // If reached the selection start line and char, start highlighting chars.
        if (scrolledSelection !== null &&
            pos.line === scrolledSelection.startLine && 
            pos.char === scrolledSelection.startChar) {
          
          isCharSelected = true;
        }

        let isCharCaret = 
          scrolledCaretPosition.char === pos.char && 
          scrolledCaretPosition.line === pos.line;

        if (scrolledCaretPosition.line === lineIndex &&
            scrolledCaretPosition.char === visibleCharsLength &&
            charIndex === visibleCharsLength - 1) {
              isCharCaret = true;
        }

        charElements.push(
          <i 
            key={`i${this.nextNumber()}`} 
            className={
              ("ch " +
              (isCharCaret ? "crt " : " ") +  
              (isCharSelected ? "chs ": " ")) +
              (this.state.caretPos.line === lineIndex && this.state.caretPos.char === -1 && charIndex === 0 ? "cs" : "")
            }
            onMouseDown={(event) => { this.handleMouseDown(event, pos); }}
            onMouseMove={(event) => { this.handleMouseMove(event, pos); }}
            onMouseUp={(event) => { this.handleMouseUp(event, pos); }}
          >{this.props.lines[lineIndex + visibleRange.startLine][charIndex + visibleRange.startChar]}</i>
        );

        // If past the selection stop line and char, stop highlighting chars.
        if (scrolledSelection !== null &&
            lineIndex === scrolledSelection.stopLine &&
            charIndex === scrolledSelection.stopChar) {

          isCharSelected = false;
        }
      }

      const eolPos: TextPosition = {
        char: visibleCharsLength,
        line: lineIndex
      };

      lineElements.push(
        <div 
          key={`${this.nextNumber()}`}
          className={("ln " + (isLineSelected ? "lns " : " "))}
          onMouseDown={(event) => { this.handleMouseDown(event, eolPos); }}
          onMouseMove={(event) => { this.handleMouseMove(event, eolPos); }}
          onMouseUp={(event) => { this.handleMouseUp(event, eolPos); }}
          >{charElements}</div>
      );
    }

    return lineElements;
  }

  mouseDownPos: TextPosition | null = null;

  clearSelection() : void {    

    this.setState({ textSelection: null });
  }

  updateSelectionState(newMousePos: TextPosition) : void {

    if (this.mouseDownPos !== null) {

      if (this.mouseDownPos.char !== newMousePos.char || 
          this.mouseDownPos.line !== newMousePos.line) {

        let textSelection: TextRange = {
          startChar: this.mouseDownPos.char,
          startLine: this.mouseDownPos.line,
          stopChar: newMousePos.char,
          stopLine: newMousePos.line
        };

        // Swap them around if the user has highlighted backwards.

        if (this.mouseDownPos.line > newMousePos.line || 
           (this.mouseDownPos.line === newMousePos.line && this.mouseDownPos.char > newMousePos.char)) {

            textSelection = {
            startChar: textSelection.stopChar,
            startLine: textSelection.stopLine,
            stopChar: textSelection.startChar,
            stopLine: textSelection.startLine
          }
        }

        this.setState({ textSelection: textSelection });
      }
      else {

        this.clearSelection();
      }
    }
  }

  handleMouseDown(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, mousePos: TextPosition) : void {

    event.stopPropagation();

    this.mouseDownPos = {
      char: mousePos.char + this.state.scrollX,
      line: mousePos.line + this.state.scrollY
    };

    this.props.onFocus();
  }

  handleMouseMove(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, mousePos: TextPosition) : void {

    event.stopPropagation();

    // Prevent weird behaviour when the mouse button was released while the
    // mouse pointer was outside of the input pane, and therefore was not handled.
    if (event.buttons === 0) {

      this.mouseDownPos = null;
    }

    this.updateSelectionState({
      char: mousePos.char + this.state.scrollX,
      line: mousePos.line + this.state.scrollY
    });
  }

  handleMouseUp(event: React.MouseEvent<HTMLSpanElement, MouseEvent>, mousePos: TextPosition) : void {

    event.stopPropagation();

    this.updateSelectionState({
      char: mousePos.char + this.state.scrollX,
      line: mousePos.line + this.state.scrollY
    });

    this.mouseDownPos = null;

    this.setState({ 
      caretPos: {
        char: mousePos.char,
        line: mousePos.line
      }
    });
  }

  handleArrowKey(event: KeyboardEvent) : void {

    let char = this.state.caretPos.char;
    let line = this.state.caretPos.line;

    let scrollX = this.state.scrollX;
    let scrollY = this.state.scrollY;

    const visibleHeight = this.getVisibleHeight();
    const visibleWidth = this.getVisibleWidth();

    if (event.code === "ArrowLeft") {
      
      if (char >= 0) {
        char--;
      } else if (scrollX > 0) {
        scrollX--;
      } else if (line > 0) {
        line--;
        char = this.props.lines[this.state.scrollY + line].length - 1;

        scrollX = 0;

        while (char >= scrollX + visibleWidth) {
          scrollX++;
        }

        char -= scrollX;
      }
    }
    else if (event.code === "ArrowRight") {

      if (char < visibleWidth - 1 && char < this.props.lines[this.state.scrollY + line].length - 1) {
        char++;
      }
      else if (scrollX + visibleWidth < this.props.lines[this.state.scrollY + line].length) {
        scrollX++;
      }
      else {
        line++;
        char = -1;
        scrollX = 0;
      }
    }
    else if (event.code === "ArrowUp") {
      
      if (line > 0) {
        line--;
        if (char >= this.props.lines[this.state.scrollY + line].length) {
          char = this.props.lines[this.state.scrollY + line].length - 1;
        }
      } 
      else if (scrollY > 0) {
        scrollY--;
      }
    }
    else if (event.code === "ArrowDown" && line < this.props.lines.length - 1) {
      
      if (line < visibleHeight - 1) {
        line++;
      }
      else if (scrollY + visibleHeight < this.props.lines.length) {
        scrollY++;
      }
    }
    else if (event.code === "Home") {
      char = -1;
      scrollX = 0;
    }
    else if (event.code === "End") {
      char = this.props.lines[this.state.scrollY + line].length - 1;

      while (char >= scrollX + visibleWidth) {
        scrollX++;
      }

      char -= scrollX;
    }

    this.setState({ 
      caretPos: { char: char, line: line },
      scrollX: scrollX,
      scrollY: scrollY
    });

    this.clearSelection();
  }

  handleKeyDown(event: KeyboardEvent) : void {

    if (!this.props.hasFocus) {
      return;
    }

    if (event.ctrlKey || event.key.length === 1) {
      event.preventDefault();
    }

    let charIndex = this.state.caretPos.char + 1;
    let lineIndex = this.state.caretPos.line;

    const isArrowKey = event.code.indexOf("Arrow") === 0 || event.code === "Home" || event.code === "End";

    if (isArrowKey) {

      this.handleArrowKey(event);
      return;
    }

    let linesWithSelectedTextRemoved = this.props.lines;

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

        this.setState({ textSelection: {
          startChar: 0,
          startLine: 0,
          stopChar: this.props.lines[this.props.lines.length - 1].length,
          stopLine: this.props.lines.length
        }});
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
            pasteText = this.props.textUtilsService.RemoveTrailing(pasteText, "\r");

            this.props.insertInputPaneText(
              linesWithSelectedTextRemoved,
              charIndex + this.state.scrollX,
              lineIndex + this.state.scrollY,
              pasteText
            );

            const lines = this.props.textUtilsService.TextToLines(pasteText);
            const lastLine = lines[lines.length - 1];

            charIndex = lines.length === 1 ? charIndex + lastLine.length : lastLine.length;
            lineIndex = lineIndex + lines.length - 1;

            // We have to do the setState and clearSelection here as we're inside a callback.

            this.setState({
              caretPos: {
                char: charIndex - 1,
                line: lineIndex
              }
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
            startChar: this.state.caretPos.char + this.state.scrollX,
            startLine: this.state.caretPos.line + this.state.scrollY,
            stopChar: this.state.caretPos.char + this.state.scrollX,
            stopLine: this.state.caretPos.line + this.state.scrollY
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
            startChar: this.state.caretPos.char + this.state.scrollX + 1,
            startLine: this.state.caretPos.line + this.state.scrollY,
            stopChar: this.state.caretPos.char + this.state.scrollX + 1,
            stopLine: this.state.caretPos.line + this.state.scrollY
          }
        );
      }

      changed = true;
    }
    else if (event.key.length === 1) {

      // A letter, number of symbol key has been pressed.

      this.props.insertInputPaneText(
        linesWithSelectedTextRemoved,
        charIndex + this.state.scrollX,
        lineIndex + this.state.scrollY,
        event.key
      );

      charIndex++;

      changed = true;
    }

    this.setState({
      caretPos: {
        char: charIndex - 1,
        line: lineIndex
      }
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
        style={{ flexDirection: "column" }}>
        <div style={{
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            flexGrow: 1
          }}>
          <div className="input-pane__textarea textarea" 
               onMouseDown={(event) => { this.handleMouseDown(event, { char: 0, line: 0 }); }}
               onMouseUp={(event) => { this.handleMouseUp(event, { char: 0, line: 0 }); }}>
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
