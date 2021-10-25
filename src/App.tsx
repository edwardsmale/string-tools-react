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
import { BlankCommand } from './services/commands/blank-command';
import { CamelCommand } from './services/commands/camel-command';
import { PascalCommand } from './services/commands/pascal-command';
import { KebabCommand } from './services/commands/kebab-command';
import { UpperCommand } from './services/commands/upper-command';
import { LowerCommand } from './services/commands/lower-command';
import HelpPopupContent from './components/HelpPopupContent/HelpPopupContent';
import ContextPopupContent from './components/ContextPopupContent/ContextPopupContent';
import { Context } from './interfaces/Context';
import { DistinctCommand } from './services/commands/distinct-command';
import { TrimCommand, TrimEndCommand, TrimStartCommand } from './services/commands/trim-command';
import { RemoveCommand } from './services/commands/remove-command';
import { EnsureLeadingCommand } from './services/commands/ensure-leading-command';
import { EnsureTrailingCommand } from './services/commands/ensure-trailing-command';
import { RemoveLeadingCommand } from './services/commands/remove-leading-command';
import { RemoveTrailingCommand } from './services/commands/remove-trailing-command';

interface AppProps {
}

interface AppState {
  focus: string;
  code: string;
  compressedCode: string;
  explanation: string;
  input: string[];
  inputHash: number;
  inputFiles: string[];
  output: string[][];
  outputHash: number;
  context: Context;
  topSectionHeight: number;
  bottomButtonBarHeight: number;
  bottomSectionHeight: number;
  codeWindowWidth: number;
  inputPaneWidth: number;
  outputPaneWidth: number;
  draggedBorder: string | undefined;
  isHelpPopupVisible: boolean;
  isContextPopupVisible: boolean;
  isMouseDown: boolean;
  mouseX: number;
  mouseY: number;
  darkmode: boolean;
}

class App extends React.Component<AppProps, AppState> {

  inputPaneValue :string[];
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
    this.commandTypesService = new CommandTypesService(this.textUtilsService, new SortService(this.textUtilsService), new ContextService(this.textUtilsService), new CamelCommand(this.textUtilsService), new PascalCommand(this.textUtilsService), new KebabCommand(this.textUtilsService), new UpperCommand(this.textUtilsService), new LowerCommand(this.textUtilsService), new DistinctCommand(), new BlankCommand(this.textUtilsService), new TrimCommand(), new TrimStartCommand(), new TrimEndCommand(), new RemoveCommand(), new EnsureLeadingCommand(this.textUtilsService), new EnsureTrailingCommand(this.textUtilsService), new RemoveLeadingCommand(this.textUtilsService), new RemoveTrailingCommand(this.textUtilsService));

    this.commandService = new CommandService(
      this.textUtilsService,
      new CommandParsingService(this.textUtilsService, this.commandTypesService), 
      this.commandTypesService, 
      new ContextService(this.textUtilsService)
    );

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

    this.inputPaneValue = this.textUtilsService.TextToLines(input);
    this.codeWindowValue = `regex 12:01:
match`;

    this.state = {
      focus: "InputPane",
      code: this.codeWindowValue,
      compressedCode: this.codeCompressionService.CompressCode(this.codeWindowValue),
      explanation: "",
      input: this.inputPaneValue,
      inputHash: 0,
      inputFiles: [],
      output: [[]],
      outputHash: 0,
      context: this.contextService.CreateContext(),
      topSectionHeight: 12,
      bottomButtonBarHeight: 2.5,
      bottomSectionHeight: 44,
      codeWindowWidth: 45,
      inputPaneWidth: 50,
      outputPaneWidth: 80,
      draggedBorder: undefined,
      isHelpPopupVisible: false,
      isContextPopupVisible: false,
      isMouseDown: false,
      mouseX: 0,
      mouseY: 0,  
      darkmode: true
    };

    this.executeCodeTimeout = null;

    this.removeInputPaneText = this.removeInputPaneText.bind(this);
    this.insertInputPaneText = this.insertInputPaneText.bind(this);
    this.getInputPaneText = this.getInputPaneText.bind(this);
    this.setInputPane = this.setInputPane.bind(this);

    this.handleCodeWindowSelect = this.handleCodeWindowSelect.bind(this);
    this.handleCodeWindowInput = this.handleCodeWindowInput.bind(this);
    this.executeCommands = this.executeCommands.bind(this);
    this.executeCode = this.executeCode.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.UpdateWidthsAndHeights = this.UpdateWidthsAndHeights.bind(this);
    this.LocationHashChanged = this.LocationHashChanged.bind(this);
    this.UpdateCodeFromLocationHash = this.UpdateCodeFromLocationHash.bind(this);
    this.openHelpPopup = this.openHelpPopup.bind(this);
    this.closeHelpPopup = this.closeHelpPopup.bind(this);
    this.openContextPopup = this.openContextPopup.bind(this);
    this.closeContextPopup = this.closeContextPopup.bind(this);
    this.toggleDarkmode = this.toggleDarkmode.bind(this);
    this.importFileClick = this.importFileClick.bind(this);
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

  UpdateWidthsAndHeights() {

    // Adjust output pane width and bottom section height to fill the available 
    // space (given the  input pane width).

    const availableVerticalSpace = (window.innerHeight / 16) - this.state.bottomButtonBarHeight;

    this.setState({
      outputPaneWidth: window.innerWidth / 16 - this.state.inputPaneWidth - 2,
      bottomSectionHeight: availableVerticalSpace - this.state.topSectionHeight
    });
  }

  componentDidMount() {

    this.UpdateWidthsAndHeights();   

    window.addEventListener("hashchange", this.LocationHashChanged);
    
    if (window.location.hash) {
      
      this.UpdateCodeFromLocationHash();
    }

    this.executeCode(this.codeWindowValue, false);

    window.addEventListener("keydown", this.keyDown);

    window.addEventListener('resize', this.UpdateWidthsAndHeights)
  }

  componentWillUnmount() {

    window.removeEventListener("hashchange", this.LocationHashChanged);

    window.removeEventListener("keydown", this.keyDown);

    window.removeEventListener("keydown", this.keyDown);

    window.removeEventListener('resize', this.UpdateWidthsAndHeights)
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

  setInputPane(lines: string[]) : void {

    this.inputPaneValue = lines;

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

    this.setInputPane(result);
  }

  insertInputPaneText(lines: string[], charIndex: number, lineIndex: number, textToInsert: string) : void {

    const result = this.textUtilsService.InsertSubText(
      lines,
      charIndex,
      lineIndex,
      textToInsert
    );

    this.setInputPane(result);
  }

  handleCodeWindowInput(code: string) {

    this.setState({code: code});
        
    this.codeWindowValue = code;

    const compressedCode = this.codeCompressionService.CompressCode(code);
    
    window.location.hash = "#" + compressedCode;
  }
  
  private previousCodeWindowCode: string = "";

  handleCodeWindowSelect(code: string) {

    const txtarea = document.getElementsByClassName("js-code-window-textarea")[0] as HTMLTextAreaElement;

    const start = txtarea.selectionStart;
    const finish = txtarea.selectionEnd;

    if (finish - start > 0) {

      const selectedCode = txtarea.value.substring(start, finish);

      const returnCount = txtarea.value.substring(0, start).split(/\n/g).filter(i => i).length;

      code = "\n".repeat(returnCount) + selectedCode;
    }

    if (code !== this.previousCodeWindowCode) {

      this.executeCode(code, true);

      this.previousCodeWindowCode = code;
    }
  }

  private executeCodeTimeout: NodeJS.Timeout | null;

  executeCode(code: string, isSelect: boolean) {

    if (this.executeCodeTimeout) {
      clearTimeout(this.executeCodeTimeout);
    }

    const that = this;

    let timeoutLength: number;

    if (this.inputPaneValue.length < 100) {
      timeoutLength = 0;
    }
    else if (this.inputPaneValue.length < 1000) {
      timeoutLength = 0;
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

  private executeCommands(input: string[], code: string): string[][] {

    return this.processCommands(input, code, false);
  }

  private lastExplanation: string = "";
  private lastExplainCode: string = "";

  private explainCommands(input: string[], code: string): string {

    if (code !== this.lastExplainCode) {

      this.lastExplainCode = code;
      this.lastExplanation =  this.processCommands(input, code, true).join("\n");
    }

    return this.lastExplanation;
  }

  private processCommands(input: string[], code: string, explain: boolean): string[][] {

    const context = this.contextService.CreateContext();

    const result = this.commandService.processCommands(code, input, explain, context);

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

    if (this.state.draggedBorder === "top-section-border") {

      this.setState({ 
        topSectionHeight: e.clientY / 16,
        draggedBorder: undefined
      }, () => {
        this.UpdateWidthsAndHeights();
      });

    }
    else if (this.state.draggedBorder === "code-window-border") {
      this.setState({ 
        codeWindowWidth: e.clientX / 16,
        draggedBorder: undefined
      });
    }
    else if (this.state.draggedBorder === "input-pane-border") {
      this.setState({
        inputPaneWidth: e.clientX / 16,
        outputPaneWidth: (window.innerWidth - e.clientX) / 16 - 2,
        draggedBorder: undefined
      });
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

  toggleDarkmode() {
    this.setState({ darkmode: !this.state.darkmode});
  }

  importFileClick() {
    const fileInput = document.getElementsByClassName("js-input-pane-file-input")[0];

    fileInput.click();
  }

  showFile(e: React.ChangeEvent<HTMLInputElement>) {

    e.preventDefault();

    if (e.target && e.target.files) {

      let filenames = [];

      for (let i = 0; i < e.target.files.length; i++) {

        filenames.push(e.target.files[i].name);
      }      

      this.setState({inputFiles: filenames});
    }

    function readFileAsText(file: any){

      return new Promise(function(resolve,reject){
          let fr = new FileReader();

          fr.onload = function(){
              resolve(fr.result);
          };

          fr.onerror = function(){
              reject(fr);
          };

          fr.readAsText(file);
      });
    }

    let contents = "";

    if (e.target && e.target.files) {

      let readers = [];

      for (let i = 0; i < e.target.files.length; i++) {

        readers.push(readFileAsText(e.target.files[i]));
      }
      
      Promise.all(readers).then((values) => {

        for (let i = 0; i < values.length; i++) {
          
          contents += values[i] + "\n";
        }

        this.setInputPane(contents.split("\n"));
      });
    }
  }

  render() {
    return (
      <div className={`App ${this.state.darkmode ? "App--darkmode" : ""}`} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseMove={this.mouseMove}>
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
             onDragEnd={this.onDragEnd}>
             <div className="string-tools__popup-links popup-links">
              <div className="popup-links__link darkmode-link" onClick={this.toggleDarkmode}></div>
              <div className="popup-links__separator">|</div>
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
            <div className={"string-tools__code-window-border " + (this.state.draggedBorder === "code-window-border" ? "string-tools__code-window-border--dragged" : "")} draggable onDragStart={this.onDragStart} data-border-id="code-window-border"></div>
            <div className="string-tools__explain-window-container">
              <ExplainWindow explanation={this.state.explanation}
                             onFocus={() => { this.setState({ focus: "ExplainWindow" }); }}
                             hasFocus={this.state.focus === "ExplainWindow"}
                             textUtilsService={this.textUtilsService} />
            </div>
          </div>
          <div className={"string-tools__top-section-border " + (this.state.draggedBorder === "top-section-border" ? "string-tools__top-section-border--dragged" : "")}
               draggable onDragStart={this.onDragStart}
               data-border-id="top-section-border"></div>
          <div className="string-tools__bottom-button-bar" style={ { height: "2.5rem" }}>
            <div className="string-tools__input-pane-file-input-wrapper">
              <div className="string-tools__input-pane-file-input-replacement">
                <button className="string-tools__input-pane-file-input-replacement-button"
                        onClick={this.importFileClick}>Import File(s)</button>
                <div className="string-tools__input-pane-file-input-file-list">{this.state.inputFiles.join(" | ")}</div>
              </div>
              <input type="file" 
                     className="string-tools__input-pane-file-input js-input-pane-file-input" 
                     multiple={true} 
                     onChange={(e) => this.showFile(e)} />
            </div>
          </div>
          <div className="panes-container">
            <div className="string-tools__input-pane-container" style={ { width: this.state.inputPaneWidth + "rem" }}>
              <InputPane 
                key="InputPane"
                onFocus={() => { this.setState({ focus: "InputPane" }); }}
                hasFocus={this.state.focus === "InputPane"}
                keyDownEventHandlers={this.keyDownEventHandlers}
                removeInputPaneText={this.removeInputPaneText}
                getInputPaneText={this.getInputPaneText}
                setInputPaneLines={this.setInputPane}
                insertInputPaneText={this.insertInputPaneText}
                lines={this.state.input}
                hash={this.state.inputHash}
                width={this.state.inputPaneWidth} 
                charWidth={0.4}
                height={this.state.bottomSectionHeight}
                lineHeight={1.25} 
                isMouseDown={this.state.isMouseDown}
                mouseX={this.state.mouseX}
                mouseY={this.state.mouseY}
                textUtilsService={this.textUtilsService} />
            </div>
            <div className={"string-tools__input-pane-border " + (this.state.draggedBorder === "input-pane-border" ? "string-tools__input-pane-border--dragged" : "")} 
                 draggable onDragStart={this.onDragStart} 
                 data-border-id="input-pane-border"></div>
            <div className="string-tools__output-pane-container">
              <OutputPane 
                key="OutputPane"
                onFocus={() => { this.setState({ focus: "OutputPane" }); }}
                hasFocus={this.state.focus === "OutputPane"}
                keyDownEventHandlers={this.keyDownEventHandlers}
                output={this.state.output} 
                hash={this.state.outputHash}
                width={this.state.outputPaneWidth}
                charWidth={0.4}
                height={this.state.bottomSectionHeight}
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
