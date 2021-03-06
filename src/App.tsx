import React from 'react';
import './App.scss';
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

interface AppProps {
}

interface AppState {
  code: string;
  compressedCode: string;
  explanation: string;
  input: string;
  output: string[][];
  topSectionHeight: number;
  codeWindowWidth: number;
  inputPaneWidth: number;
  draggedBorder: string | undefined;
}

class App extends React.Component<AppProps, AppState> {

  inputPaneValue :string;
  codeWindowValue :string;
  textUtilsService: TextUtilsService;
  codeCompressionService: CodeCompressionService;
  contextService: ContextService;

  constructor(props: AppProps) {
    super(props)

    this.textUtilsService = new TextUtilsService();
    this.codeCompressionService = new CodeCompressionService(this.textUtilsService);
    this.contextService = new ContextService(this.textUtilsService);

//     const input = `Id,AccountRef,FirstName,LastName,City,Worth
// 1,W11111,Edward,Smale,Leighton Buzzard,999.99
// 1,W11112,Edward,Smale,Sheffield,800.01
// 2,W22222,Stephen,Smale,Sheffield,700.50
// 3,W33333,Jo,Smale,Roehampton,1100.45
// 4,W44444,Jo,Burton,Barnes,1200.32
// 5,W55555,Edward,Burton,London,44.76`;

const input = `Name VARCHAR(100) NOT NULL,
Brand VARCHAR(100) NOT NULL,
Colour VARCHAR(100) NULL,
BasePrice MONEY NOT NULL,
RRP MONEY NULL
`;

    this.inputPaneValue = input;
    this.codeWindowValue = `split
select 0,1,2,3
with 1
  search W
  replace Q
csv
`;

    if (window.location.hash) {
      
      this.UpdateCodeFromLocationHash();
    }

    this.state = {
      code: this.codeWindowValue,
      compressedCode: this.codeCompressionService.CompressCode(this.codeWindowValue),
      explanation: this.explainCommands(input, this.codeWindowValue),
      input: input,
      output: [[]],
      topSectionHeight: 12,
      codeWindowWidth: 30,
      inputPaneWidth: 50,
      draggedBorder: undefined
    };

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
  }

  UpdateCodeFromLocationHash() {

    let compressedCode = window.location.hash.substr(1);

    let code = this.codeCompressionService.DecompressCode(compressedCode);

    this.codeWindowValue = code;
    
    this.setState({code: code});
  }

  LocationHashChanged() {

    this.UpdateCodeFromLocationHash();
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.LocationHashChanged);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.LocationHashChanged);
  }

  handleInputPaneInput(input: string) {
    
    this.inputPaneValue = input.replace(/\\n/g, String.fromCharCode(0));

    this.setState({input: input});

    this.executeCode(this.codeWindowValue);
  }

  handleCodeWindowInput(code: string) {
        
    this.codeWindowValue = code;

    let compressedCode = this.codeCompressionService.CompressCode(code);
    
    window.location.hash = "#" + compressedCode;

    this.setState({code: code});

    this.executeCode(code);
  }

  handleCodeWindowSelect(code: string) {

    let txtarea = document.getElementsByClassName("js-code-window-textarea")[0] as HTMLTextAreaElement;

    let start = txtarea.selectionStart;
    let finish = txtarea.selectionEnd;

    if (finish - start > 0) {

      let selectedCode = txtarea.value.substring(start, finish);

      let returnCount = txtarea.value.substring(0, start).split(/\n/g).filter(i => i).length;

      selectedCode = "\n".repeat(returnCount) + selectedCode;

      this.executeCode(selectedCode);
    }
    else {

      this.executeCode(code);
    }
  }

  executeCode(code: string) {

    let result = this.executeCommands(this.inputPaneValue, code);
    let explanation = this.explainCommands(this.inputPaneValue, code);
    
    this.setState({ output: result, explanation: explanation });
  }

  private executeCommands(input: string, code: string): string[][] {

    return this.processCommands(input, code, false);
  }

  private explainCommands(input: string, code: string): string {

    return this.processCommands(input, code, true).join("\n");
  }

  private processCommands(input: string, code: string, explain: boolean): string[][] {

    const commandService = this.getCommandService();

    let lines = this.textUtilsService.TextToLines(input);

    let context = this.contextService.CreateContext();

    const result = commandService.processCommands(code, lines, explain, context);

    return result; 
  }

  getCommandService(): CommandService {

    let sortService = new SortService(this.textUtilsService);

    let commandTypesService = new CommandTypesService(
      this.textUtilsService,
      sortService,
      this.contextService,
      new CamelCommand(this.textUtilsService),
      new PascalCommand(this.textUtilsService),
      new KebabCommand(this.textUtilsService)
    );

    let commandParsingService = new CommandParsingService(
      this.textUtilsService,
      commandTypesService
    );

    let contextService = new ContextService(
      this.textUtilsService
    );
    
    return new CommandService(
      this.textUtilsService,
      commandParsingService, 
      commandTypesService, 
      contextService
    );
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

  render() {
    return (
      <div className="App">
        <div className="string-tools" onDragOver={this.onDragOver} onDragEnd={this.onDragEnd}>
          <div className="string-tools__top-section" style={ { height: this.state.topSectionHeight + "rem" }}>
            <div className="string-tools__code-window-container" style={ { width: this.state.codeWindowWidth + "rem" }}>
              <CodeWindow onInput={this.handleCodeWindowInput}
                          onSelect={this.handleCodeWindowSelect}
                          textUtilsService={this.textUtilsService} value={this.state.code} />
            </div>
            <div className="string-tools__code-window-border" draggable onDragStart={this.onDragStart} data-border-id="code-window-border"></div>
            <div className="string-tools__explain-window-container">
              <ExplainWindow explanation={this.state.explanation} textUtilsService={this.textUtilsService} />
            </div>
          </div>
          <div className="string-tools__top-section-border" draggable onDragStart={this.onDragStart} data-border-id="top-section-border"></div>
          <div className="panes-container">
            <div className="string-tools__input-pane-container" style={ { width: this.state.inputPaneWidth + "rem" }}>
              <InputPane onInput={this.handleInputPaneInput} value={this.state.input} />
            </div>
            <div className="string-tools__input-pane-border" draggable onDragStart={this.onDragStart} data-border-id="input-pane-border"></div>
            <div className="string-tools__output-pane-container">
              <OutputPane output={this.state.output} textUtilsService={this.textUtilsService} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
