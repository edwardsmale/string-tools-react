import React from 'react';
import './App.scss';
import CodeWindow from './components/CodeWindow/CodeWindow';
import ContextPopupContent from './components/ContextPopupContent/ContextPopupContent';
import ExplainWindow from './components/ExplainWindow/ExplainWindow';
import HelpPopupContent from './components/HelpPopupContent/HelpPopupContent';
import InputPane from './components/InputPane/InputPane';
import OutputPane from './components/OutputPane/OutputPane';
import Popup from './components/Popup/Popup';
import { Explanation } from './interfaces/CommandInterfaces';
import { Context } from './interfaces/Context';
import { TextRange } from './interfaces/TextRange';
import { CommandParsingService } from './services/command-parsing.service';
import { CommandTypesService } from './services/command-types.service';
import { CommandService } from './services/command.service';
import { Services } from './services/services';
import './textarea.scss';

interface AppProps {
}

interface AppState {
  focus: string;
  code: string;
  compressedCode: string;
  explanation: Explanation[];
  input: string[];
  inputHash: number;
  inputFiles: string[];
  output: string[][];
  outputHash: number;
  firstLineContext: Context;
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

  codeWindowValue :string;

  services: Services;
  commandTypesService: CommandTypesService;
  commandParsingService: CommandParsingService;
  commandService: CommandService;

  constructor(props: AppProps) {
    super(props)

    this.services = new Services();

    this.commandTypesService = new CommandTypesService(this.services);
    this.commandParsingService = new CommandParsingService(this.commandTypesService);

    this.commandService = new CommandService(
      this.services,
      this.commandParsingService, 
      this.commandTypesService
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

    this.codeWindowValue = `regex 12:01:
match`;

    this.state = {
      focus: "InputPane",
      code: this.codeWindowValue,
      compressedCode: this.services.codeCompression.CompressCode(this.codeWindowValue),
      explanation: [],
      input: this.services.text.TextToLines(input),
      inputHash: 0,
      inputFiles: [],
      output: [[]],
      outputHash: 0,
      firstLineContext: this.services.context.CreateContext(),
      topSectionHeight: 12,
      bottomButtonBarHeight: 2.5,
      bottomSectionHeight: 30,
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

    this.updateHashTimeout = null;
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

    const code = this.services.codeCompression.DecompressCode(compressedCode);

    this.codeWindowValue = code;
    
    this.setState({code: code});
  }

  LocationHashChanged() {

    this.UpdateCodeFromLocationHash();
  }

  UpdateWidthsAndHeights() {

    // Adjust output pane width and bottom section height to fill the available 
    // space (given the  input pane width).

    const availableVerticalSpace = (window.innerHeight / 16) - this.state.bottomButtonBarHeight - 1;

    this.setState({
      outputPaneWidth: window.innerWidth / 16 - this.state.inputPaneWidth - 2,
      bottomSectionHeight: availableVerticalSpace - this.state.topSectionHeight
    });
  }

  componentDidMount() {

    this.UpdateWidthsAndHeights();   

    //window.addEventListener("hashchange", this.LocationHashChanged);
    
    if (window.location.hash) {
      
      this.UpdateCodeFromLocationHash();
    }

    this.executeCode(this.codeWindowValue, false);

    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("resize", this.UpdateWidthsAndHeights)
  }

  componentWillUnmount() {

    //window.removeEventListener("hashchange", this.LocationHashChanged);
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener("keydown", this.keyDown);
    window.removeEventListener('resize', this.UpdateWidthsAndHeights);
  }

  getInputPaneText(lines: string[], textSelection: TextRange) : string {

    return this.services.text.GetSubText(lines, textSelection);
  }

  setInputPane(lines: string[]) : void {

    this.setState({
      input: lines,
      inputHash: this.state.inputHash + 1
    });

    this.executeCode(this.codeWindowValue, false);
  }

  removeInputPaneText(lines: string[], textSelection: TextRange) : void {

    const result = this.services.text.RemoveSubText(lines, textSelection);

    this.setInputPane(result);
  }

  insertInputPaneText(lines: string[], charIndex: number, lineIndex: number, textToInsert: string) : void {

    const result = this.services.text.InsertSubText(
      lines,
      charIndex,
      lineIndex,
      textToInsert
    );

    this.setInputPane(result);
  }

  private updateHashTimeout: number | null;

  handleCodeWindowInput(code: string) {

    this.setState({code: code});
        
    this.codeWindowValue = code;

    if (this.updateHashTimeout) {
      clearTimeout(this.updateHashTimeout);
    }

    const that = this;

    window.setTimeout(function () {

      const compressedCode = that.services.codeCompression.CompressCode(code);
    
      window.location.hash = "#" + compressedCode;
    }, 500);
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

  private executeCodeTimeout: number | null;

  executeCode(code: string, isSelect: boolean) {

    if (this.executeCodeTimeout) {
      clearTimeout(this.executeCodeTimeout);
    }

    const that = this;
    
    var doExecute = () => {

      const result = that.executeCommands(that.state.input, code);
      const explanation = that.explainCommands(code);

      that.setState({ 
        output: result,
        outputHash: that.state.outputHash + 1,
        explanation: explanation 
      });
    };

    if (this.state.input.length < 1000 || isSelect) {
      doExecute();
    }
    else {
      this.executeCodeTimeout = window.setTimeout(doExecute, 500);
    }
  }

  private executeCommands(input: string[], code: string): string[][] {

    const result = this.commandService.processCommands(code, input);

    this.setState({ firstLineContext: this.commandService.firstLineContext });

    return result;
  }

  private lastExplanation: Explanation[] = [];
  private lastExplainCode: string = "";

  private explainCommands(code: string): Explanation[] {

    if (code !== this.lastExplainCode) {

      const context = this.services.context.CreateContext();

      this.lastExplainCode = code;
      this.lastExplanation = this.commandService.explainCommands(code, context);
    }

    return this.lastExplanation;
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

    if (e.target && e.target.files) {

      let readers = [];

      for (let i = 0; i < e.target.files.length; i++) {

        readers.push(readFileAsText(e.target.files[i]));
      }

      let lines: string[] = [];
      
      Promise.all(readers).then((values) => {

        for (let i = 0; i < values.length; i++) {
          
          const l = this.services.text.TextToLines(values[i] as string);

          for (let j = 0; j < l.length; j++) {

            lines.push(l[j]);
          }
        }

        this.setInputPane(lines);
      });
    }
  }

  render() {
    return (
      <div className={`App ${this.state.darkmode ? "App--darkmode" : ""}`} 
           onMouseDown={this.mouseDown} 
           onMouseUp={this.mouseUp} 
           onMouseMove={this.mouseMove}>
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
              <ContextPopupContent firstLineContext={this.state.firstLineContext} />
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
          <div className="string-tools__top-section"
               style={ { height: this.state.topSectionHeight + "rem", maxHeight: this.state.topSectionHeight + "rem", overflow: "hidden" }}>
            <div className="string-tools__code-window-container" style={ { width: this.state.codeWindowWidth + "rem" }}>
              <CodeWindow onInput={this.handleCodeWindowInput}
                          onSelect={this.handleCodeWindowSelect}
                          onFocus={() => { this.setState({ focus: "CodeWindow" }); }}
                          hasFocus={this.state.focus === "CodeWindow"}
                          services={this.services} value={this.state.code} />
            </div>
            <div className={"string-tools__code-window-border " + (this.state.draggedBorder === "code-window-border" ? "string-tools__code-window-border--dragged" : "")} draggable onDragStart={this.onDragStart} data-border-id="code-window-border"></div>
            <div className="string-tools__explain-window-container">
              <ExplainWindow explanation={this.state.explanation}
                             onFocus={() => { this.setState({ focus: "ExplainWindow" }); }}
                             hasFocus={this.state.focus === "ExplainWindow"} />
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
                charWidth={0.45}
                height={this.state.bottomSectionHeight}
                lineHeight={1.25} 
                services={this.services}
                isMouseDown={this.state.isMouseDown}
                mouseX={this.state.mouseX}
                mouseY={this.state.mouseY} />
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
                charWidth={0.45}
                height={this.state.bottomSectionHeight}
                lineHeight={1.25} 
                isMouseDown={this.state.isMouseDown}
                mouseX={this.state.mouseX}
                mouseY={this.state.mouseY}
                services={this.services} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
