import React from 'react';
import './App.scss';
import './textarea.scss';
import Popup from './components/Popup/Popup';
import CodeWindow from './components/CodeWindow/CodeWindow';
import ExplainWindow from './components/ExplainWindow/ExplainWindow';
import InputPane from './components/InputPane/InputPane';
import OutputPane from './components/OutputPane/OutputPane';
import { CommandParsingService } from './services/command-parsing.service';
import { CommandTypesService } from './services/command-types.service';
import { CommandService } from './services/command.service';
import { ContextService } from './services/context.service';
import { SortService } from './services/sort.service';
import { TextUtilsService } from './services/text-utils.service';
import { CodeCompressionService } from './services/code-compression.service';
import { CamelCommand } from './services/commands/camel-command';
import { PascalCommand } from './services/commands/pascal-command';
import { KebabCommand } from './services/commands/kebab-command';
import { UpperCommand } from './services/commands/upper-command';
import { LowerCommand } from './services/commands/lower-command';
import HelpPopupContent from './components/HelpPopupContent/HelpPopupContent';
import ContextPopupContent from './components/ContextPopupContent/ContextPopupContent';
import { Context } from './interfaces/Context';
import { DistinctCommand } from './services/commands/distinct-command';

interface AppProps {
}

interface AppState {
  focus: string;
  code: string;
  compressedCode: string;
  explanation: string;
  input: string[];
  inputHash: number;
  output: string[][];
  outputHash: number;
  context: Context;
  topSectionHeight: number;
  codeWindowWidth: number;
  inputPaneWidth: number;
  draggedBorder: string | undefined;
  isHelpPopupVisible: boolean;
  isContextPopupVisible: boolean;
  isMouseDown: boolean;
  mouseX: number;
  mouseY: number;
}

class App extends React.Component<AppProps, AppState> {

  inputPaneValue :string;
  codeWindowValue :string;
  textUtilsService: TextUtilsService;
  codeCompressionService: CodeCompressionService;
  contextService: ContextService;
  commandTypesService: CommandTypesService;
  commandService: CommandService;

  constructor(props: AppProps) {
    super(props)

    this.textUtilsService = new TextUtilsService();
    this.codeCompressionService = new CodeCompressionService(this.textUtilsService);
    this.contextService = new ContextService(this.textUtilsService);
    this.commandTypesService = new CommandTypesService(this.textUtilsService, new SortService(this.textUtilsService), new ContextService(this.textUtilsService), new CamelCommand(this.textUtilsService), new PascalCommand(this.textUtilsService), new KebabCommand(this.textUtilsService), new UpperCommand(this.textUtilsService), new LowerCommand(this.textUtilsService), new DistinctCommand());

    this.commandService = new CommandService(
      this.textUtilsService,
      new CommandParsingService(this.textUtilsService, this.commandTypesService), 
      this.commandTypesService, 
      new ContextService(this.textUtilsService)
    );

//     const input = `Id,AccountRef,FirstName,LastName,City,Worth
// 1,W11111,Edward,Smale,Leighton Buzzard,999.99
// 1,W11112,Edward,Smale,Sheffield,800.01
// 2,W22222,Stephen,Smale,Sheffield,700.50
// 3,W33333,Jo,Smale,Roehampton,1100.45
// 4,W44444,Jo,Burton,Barnes,1200.32
// 5,W55555,Edward,Burton,London,44.76`;

// const input = `Name VARCHAR(100) NOT NULL,
// Brand VARCHAR(100) NOT NULL,
// Colour VARCHAR(100) NULL,
// BasePrice MONEY NOT NULL,
// RRP MONEY NULL
// `;

    const input = `ReportConsole
    -------------
    [08/22/2019 12:01:19] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:01:19] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:01:19] --------------------------------------------------------------------------------
    [08/22/2019 12:01:19] No FTP host given, skipping download and extraction.
    [08/22/2019 12:01:19] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 22.255 seconds (163.230 MB/sec).
    [08/22/2019 12:01:42] Running shared patches
    [08/22/2019 12:01:43] Denormalising columns for report-console
    [08/22/2019 12:01:43] Adding functions
    [08/22/2019 12:01:43] Adding misc. indexes
    [08/22/2019 12:01:44] Patching erroneous cost prices
    [08/22/2019 12:01:44] Patching high-value uncategorised products
    [08/22/2019 12:01:44] Adding denormalised columns
    [08/22/2019 12:01:44]     adding denormalised columns to CreditCardOrderLine
    [08/22/2019 12:01:51]     adding denormalised columns to CreditCardOrder
    [08/22/2019 12:02:08] Adding UTM parameters to CreditCardOrder
    [08/22/2019 12:02:15]     adding denormalised columns to Despatch
    [08/22/2019 12:02:20]     adding denormalised columns to Account
    [08/22/2019 12:02:36]     adding denormalised columns to Category
    [08/22/2019 12:02:36] Adding date tables
    [08/22/2019 12:02:36]     adding date functions
    [08/22/2019 12:02:36]     Days table
    [08/22/2019 12:02:37]     Months table
    [08/22/2019 12:02:37]     Quarters table
    [08/22/2019 12:02:37] Adding lifeycle views
    [08/22/2019 12:02:37] Adding Integers table
    [08/22/2019 12:02:37] Adding indexes
    [08/22/2019 12:02:38] Running report console initialisation
    [08/22/2019 12:03:57] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:03:57] Up-to-date backup file already exists, skipping download. (Use -Force to download always.)
    [08/22/2019 12:03:57] --------------------------------------------------------------------------------
    [08/22/2019 12:03:57] No FTP host given, skipping download and extraction.
    [08/22/2019 12:03:57] Restoring Database
    Changed database context to 'master'.
    Processed 464984 pages for database 'OfflineReporting', file 'Paperstone_Data' on file 1.
    Processed 2 pages for database 'OfflineReporting', file 'Paperstone_Log' on file 1.
    RESTORE DATABASE successfully processed 464986 pages in 21.161 seconds (171.669 MB/sec).`;

    this.inputPaneValue = input;
    this.codeWindowValue = `regex 12:01:
    match`;

    this.state = {
      focus: "InputPane",
      code: this.codeWindowValue,
      compressedCode: this.codeCompressionService.CompressCode(this.codeWindowValue),
      explanation: this.explainCommands(input, this.codeWindowValue),
      input: this.textUtilsService.TextToLines(input),
      inputHash: 0,
      output: [[]],
      outputHash: 0,
      context: this.contextService.CreateContext(),
      topSectionHeight: 12,
      codeWindowWidth: 45,
      inputPaneWidth: 50,
      draggedBorder: undefined,
      isHelpPopupVisible: false,
      isContextPopupVisible: false,
      isMouseDown: false,
      mouseX: 0,
      mouseY: 0
    };

    this.executeCodeTimeout = null;

    this.removeInputPaneText = this.removeInputPaneText.bind(this);
    this.insertInputPaneText = this.insertInputPaneText.bind(this);
    this.getInputPaneText = this.getInputPaneText.bind(this);
    this.setInputPaneText = this.setInputPaneText.bind(this);

    this.handleInputPaneInput = this.handleInputPaneInput.bind(this);
    this.handleCodeWindowSelect = this.handleCodeWindowSelect.bind(this);
    this.handleCodeWindowInput = this.handleCodeWindowInput.bind(this);
    this.executeCommands = this.executeCommands.bind(this);
    this.executeCode = this.executeCode.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.LocationHashChanged = this.LocationHashChanged.bind(this);
    this.UpdateCodeFromLocationHash = this.UpdateCodeFromLocationHash.bind(this);
    this.openHelpPopup = this.openHelpPopup.bind(this);
    this.closeHelpPopup = this.closeHelpPopup.bind(this);
    this.openContextPopup = this.openContextPopup.bind(this);
    this.closeContextPopup = this.closeContextPopup.bind(this);
    this.showFile = this.showFile.bind(this);

    this.mouseDown = this.mouseDown.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  mouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) { 

    this.setState({ isMouseDown: true }); 
  }

  mouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) { 

    this.setState({ isMouseDown: false }); 
  }

  mouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {

    this.setState({ mouseX: e.clientX, mouseY: e.clientY }); 
  }

  keyDownEventHandlers: ((event: KeyboardEvent) => void)[] = [];

  keyDown(event: KeyboardEvent) : void {

    for (let i = 0; i < this.keyDownEventHandlers.length; i++) {

      this.keyDownEventHandlers[i](event);
    }
  }

  UpdateCodeFromLocationHash() {

    const compressedCode = window.location.hash.substr(1);

    const code = this.codeCompressionService.DecompressCode(compressedCode);

    this.codeWindowValue = code;
    
    this.setState({code: code});
  }

  LocationHashChanged() {

    this.UpdateCodeFromLocationHash();
  }

  componentDidMount() {

    window.addEventListener("hashchange", this.LocationHashChanged);
    
    if (window.location.hash) {
      
      this.UpdateCodeFromLocationHash();
    }

    this.executeCode(this.codeWindowValue, false);

    window.addEventListener("keydown", this.keyDown);
  }

  componentWillUnmount() {

    window.removeEventListener("hashchange", this.LocationHashChanged);

    window.removeEventListener("keydown", this.keyDown);
  }

  getInputPaneText(lines: string[], startCharIndex: number, startLineIndex: number, stopCharIndex: number, stopLineIndex: number) : string {

    return this.textUtilsService.GetSubText(
      lines,
      startCharIndex,
      startLineIndex,
      stopCharIndex,
      stopLineIndex
    );
  }

  setInputPaneText(lines: string[]) : void {

    this.inputPaneValue = this.textUtilsService.LinesToText(lines);

    this.setState({
      input: lines,
      inputHash: this.state.inputHash + 1
    });

    this.executeCode(this.codeWindowValue, false);
  }

  removeInputPaneText(lines: string[], startCharIndex: number, startLineIndex: number, stopCharIndex: number, stopLineIndex: number) : void {

    const result = this.textUtilsService.RemoveSubText(
      lines,
      startCharIndex,
      startLineIndex,
      stopCharIndex,
      stopLineIndex
    );

    this.inputPaneValue = this.textUtilsService.LinesToText(result);

    this.setState({
      input: result,
      inputHash: this.state.inputHash + 1
    });

    this.executeCode(this.codeWindowValue, false);
  }

  insertInputPaneText(lines: string[], charIndex: number, lineIndex: number, textToInsert: string) : void {

    const result = this.textUtilsService.InsertSubText(
      lines,
      charIndex,
      lineIndex,
      textToInsert
    );

    this.inputPaneValue = result;

    this.setState({
      input: this.textUtilsService.TextToLines(result),
      inputHash: this.state.inputHash + 1
    });

    this.executeCode(this.codeWindowValue, false);
  }

  handleInputPaneInput(input: string) {
    
    this.inputPaneValue = input
      .replace(/\\n/g, String.fromCharCode(0));

    this.setState({
      input: this.textUtilsService.TextToLines(input),
      inputHash: this.state.inputHash + 1 
    });

    this.executeCode(this.codeWindowValue, false);
  }

  handleCodeWindowInput(code: string) {

    this.setState({code: code});
        
    this.codeWindowValue = code;

    let compressedCode = this.codeCompressionService.CompressCode(code);
    
    window.location.hash = "#" + compressedCode;
  }

  handleCodeWindowSelect(code: string) {

    let txtarea = document.getElementsByClassName("js-code-window-textarea")[0] as HTMLTextAreaElement;

    let start = txtarea.selectionStart;
    let finish = txtarea.selectionEnd;

    if (finish - start > 0) {

      let selectedCode = txtarea.value.substring(start, finish);

      let returnCount = txtarea.value.substring(0, start).split(/\n/g).filter(i => i).length;

      selectedCode = "\n".repeat(returnCount) + selectedCode;

      this.executeCode(selectedCode, true);
    }
    else {

      this.executeCode(code, true);
    }
  }

  private executeCodeTimeout: NodeJS.Timeout | null;

  executeCode(code: string, isSelect: boolean) {

    if (this.executeCodeTimeout) {
      clearTimeout(this.executeCodeTimeout);
    }

    const that = this;

    let timeoutLength: number;

    if (this.inputPaneValue.length < 10000) {
      timeoutLength = 0;
    }
    else if (this.inputPaneValue.length < 200000) {
      timeoutLength = 100;
    }
    else {
      timeoutLength = isSelect ? 650 : 350;
    }

    this.executeCodeTimeout = setTimeout(function () {

      const result = that.executeCommands(that.inputPaneValue, code);
      const explanation = that.explainCommands(that.inputPaneValue, code);

      that.setState({ output: result, outputHash: that.state.outputHash + 1, explanation: explanation });
    },
    timeoutLength);
  }

  private executeCommands(input: string, code: string): string[][] {

    return this.processCommands(input, code, false);
  }

  private explainCommands(input: string, code: string): string {

    return this.processCommands(input, code, true).join("\n");
  }

  private processCommands(input: string, code: string, explain: boolean): string[][] {

    const lines = this.textUtilsService.TextToLines(input);

    const context = this.contextService.CreateContext();

    const result = this.commandService.processCommands(code, lines, explain, context);

    if (!explain) {

      this.setState({ context: context });
    }

    return result; 
  }

  onDragStart(e: React.DragEvent<HTMLDivElement>) {

    this.setState({ 
      draggedBorder: (e.target as HTMLDivElement).dataset.borderId
    })
  }

  onDragEnd(e: React.DragEvent<HTMLDivElement>) {

    this.setState({
      draggedBorder: undefined
    })
  }

  onDragOver(e: React.DragEvent<HTMLDivElement>) {

    if (this.state.draggedBorder === "top-section-border") {
      this.setState({ topSectionHeight: e.clientY / 16 });
    }
    else if (this.state.draggedBorder === "code-window-border") {
      this.setState({ codeWindowWidth: e.clientX / 16 });
    }
    else if (this.state.draggedBorder === "input-pane-border") {
      this.setState({ inputPaneWidth: e.clientX / 16 });
    }
  }

  openHelpPopup() {
    this.setState({ isHelpPopupVisible: true });
  }

  closeHelpPopup() {
    this.setState({ isHelpPopupVisible: false });
  }

  openContextPopup() {
    this.setState({ isContextPopupVisible: true });
  }

  closeContextPopup() {
    this.setState({ isContextPopupVisible: false });
  }

  showFile(e: React.ChangeEvent<HTMLInputElement>) {

    e.preventDefault();

    let contents = "";
    
    const load = (files: any) => {

      if (!files.length) {

        this.handleInputPaneInput(contents);

        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => { 
  
        if (e.target && e.target.result) {

          debugger;
  
          contents += e.target.result.toString() + "\n";

          load(files.slice(1));
        }
      };

      reader.readAsText(files[0]);
    };

    if (e.target && e.target.files) {

      let files = [];

      for (let i = 0; i < e.target.files.length; i++) {

        files.push(e.target.files[i]);
      }

      load(files);
    }
  }

  render() {
    return (
      <div className="App" onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseMove={this.mouseMove}>
        <div className={`${this.state.isHelpPopupVisible ? "" : "u-hidden"}`}>
          <Popup            
            onClose={this.closeHelpPopup}
            title="Help"
            init_left={-21}
            init_top={2}
            init_right={-1}
            init_bottom={-10}>
              <HelpPopupContent commandTypesService={this.commandTypesService} />
          </Popup>
        </div>      
        <div className={`${this.state.isContextPopupVisible ? "" : "u-hidden"}`}>
          <Popup            
            onClose={this.closeContextPopup}
            title="Context"
            init_left={-41}
            init_top={2}
            init_right={-23}
            init_bottom={18}>
              <ContextPopupContent context={this.state.context} />
          </Popup>
        </div>
        <div className="string-tools" 
             onDragOver={this.onDragOver} 
             onDragEnd={this.onDragEnd}>
             <div className="string-tools__popup-links popup-links">
              <div className="popup-links__link popup-links__context-link" onClick={this.openContextPopup}>context</div>
              <div className="popup-links__separator">|</div>
              <div className="popup-links__link popup-links__help-link" onClick={this.openHelpPopup}>help</div>
            </div>
          <div className="string-tools__top-section" style={ { height: this.state.topSectionHeight + "rem" }}>
            <div className="string-tools__code-window-container" style={ { width: this.state.codeWindowWidth + "rem" }}>
              <CodeWindow onInput={this.handleCodeWindowInput}
                          onSelect={this.handleCodeWindowSelect}
                          onFocus={() => { this.setState({ focus: "CodeWindow" }); }}
                          hasFocus={this.state.focus === "CodeWindow"}
                          textUtilsService={this.textUtilsService} value={this.state.code} />
            </div>
            <div className="string-tools__code-window-border" draggable onDragStart={this.onDragStart} data-border-id="code-window-border"></div>
            <div className="string-tools__explain-window-container">
              <ExplainWindow explanation={this.state.explanation}
                             onFocus={() => { this.setState({ focus: "ExplainWindow" }); }}
                             hasFocus={this.state.focus === "ExplainWindow"}
                             textUtilsService={this.textUtilsService} />
            </div>
          </div>
          <div className="string-tools__top-section-border" draggable onDragStart={this.onDragStart} data-border-id="top-section-border"></div>
          <div><input type="file" multiple={true} onChange={(e) => this.showFile(e)} /></div>
          <div className="panes-container">
            <div className="string-tools__input-pane-container" style={ { width: this.state.inputPaneWidth + "rem" }}>
              <InputPane 
                key="InputPane"
                onFocus={() => { this.setState({ focus: "InputPane" }); }}
                hasFocus={this.state.focus === "InputPane"}
                keyDownEventHandlers={this.keyDownEventHandlers}
                removeInputPaneText={this.removeInputPaneText}
                getInputPaneText={this.getInputPaneText}
                setInputPaneText={this.setInputPaneText}
                insertInputPaneText={this.insertInputPaneText}
                lines={this.state.input}
                hash={this.state.inputHash}
                width={this.state.inputPaneWidth} 
                charWidth={0.4}
                height={42} 
                lineHeight={1.25} 
                isMouseDown={this.state.isMouseDown}
                mouseX={this.state.mouseX}
                mouseY={this.state.mouseY}
                textUtilsService={this.textUtilsService} />
            </div>
            <div className="string-tools__input-pane-border" draggable onDragStart={this.onDragStart} data-border-id="input-pane-border"></div>
            <div className="string-tools__output-pane-container">
              <OutputPane 
                key="OutputPane"
                onFocus={() => { this.setState({ focus: "OutputPane" }); }}
                hasFocus={this.state.focus === "OutputPane"}
                keyDownEventHandlers={this.keyDownEventHandlers}
                output={this.state.output} 
                hash={this.state.outputHash}
                width={40}
                charWidth={0.4}
                height={42} 
                lineHeight={1.25} 
                isMouseDown={this.state.isMouseDown}
                mouseX={this.state.mouseX}
                mouseY={this.state.mouseY}
                textUtilsService={this.textUtilsService} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
