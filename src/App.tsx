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

interface AppProps {
}

interface AppState {
  code: string;
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

  constructor(props: AppProps) {
    super(props)

    this.textUtilsService = new TextUtilsService();

    const code = `split
header
sort $<Worth> desc
print $2,$3,$4,$5,$6`;

  const explanation = "";

  const input = `Id,AccountRef,FirstName,LastName,City,Worth
1,W11111,Edward,Smale,Leighton Buzzard,999.99
1,W11112,Edward,Smale,Sheffield,800.01
2,W22222,Stephen,Smale,Sheffield,700.50
3,W33333,Jo,Smale,Roehampton,1100.45
4,W44444,Jo,Burton,Barnes,1200.32
5,W55555,Edward,Burton,London,44.76`;

    this.inputPaneValue = input;
    this.codeWindowValue = code;

    this.state = {
      code: code,
      explanation: explanation,
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
  }

  componentDidMount() {

    this.executeCode(this.codeWindowValue);
  }

  handleInputPaneInput(input: string) {
    
    this.inputPaneValue = input;

    this.setState({input: input});

    this.executeCode(this.codeWindowValue);
  }

  handleCodeWindowInput(code: string) {
        
    this.codeWindowValue = code;

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

    const result = commandService.processCommands(code, input, explain);

    return result; 
  }

  getCommandService(): CommandService {

    let sortService = new SortService(this.textUtilsService);
    let commandTypesService = new CommandTypesService(this.textUtilsService, sortService);
    let commandParsingService = new CommandParsingService(this.textUtilsService, commandTypesService);
    let contextService = new ContextService(this.textUtilsService);
    
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
