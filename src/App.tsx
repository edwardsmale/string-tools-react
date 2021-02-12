import React from 'react';
import './App.scss';
import CodeWindow from './components/CodeWindow/CodeWindow';
import ExplainWindow from './components/ExplainWindow/ExplainWindow';
import InputPane from './components/InputPane/InputPane';
import OutputPane from './components/OutputPane/OutputPane';
import { CommandParsingService } from './services/command-parsing.service';
import { CommandTypesService } from './services/command-types.service';
import { CommandService } from './services/command.service';
import { SortService } from './services/sort.service';
import { TextUtilsService } from './services/text-utils.service';

interface AppProps {
}

interface AppState {
  code: string;
  explanation: string;
  input: string;
  output: string[][];
}

class App extends React.Component<AppProps, AppState> {

  inputPaneValue :string;
  codeWindowValue :string;
  textUtilsService: TextUtilsService;

  constructor(props: AppProps) {
    super(props)

    this.textUtilsService = new TextUtilsService();

    const code = `skip 1
split
print { accountRef: "$2", name: "$4, $3", city: "$5" }
flat 1
join ,
enclose []`;

  const explanation = "";

  const input = `Id,AccountRef,FirstName,LastName,City
1,W11111,Edward,Smale,Leighton Buzzard
1,W11112,Edward,Smale,Sheffield
2,W22222,Stephen,Smale,Sheffield
3,W33333,Jo,Smale,Roehampton
4,W44444,Jo,Burton,Barnes
5,W55555,Edward,Burton,London`;

    const output = this.executeCommands(input, code);

    this.inputPaneValue = input;
    this.codeWindowValue = code;

    this.state = {
      code: code,
      explanation: explanation,
      input: input,
      output: output
    };

    this.handleInputPaneInput = this.handleInputPaneInput.bind(this);
    this.handleCodeWindowSelect = this.handleCodeWindowSelect.bind(this);
    this.handleCodeWindowInput = this.handleCodeWindowInput.bind(this);
    this.executeCommands = this.executeCommands.bind(this);
    this.executeCode = this.executeCode.bind(this);
  }

  handleInputPaneInput(input: string) {
    
    this.inputPaneValue = input;

    let result = this.executeCommands(this.inputPaneValue, this.codeWindowValue);

    this.setState({input: input, output: result});
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

      selectedCode = "\r\n".repeat(returnCount) + selectedCode;

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
    return new CommandService(this.textUtilsService, commandParsingService, commandTypesService);
  }

  render() {
    return (
      <div className="App">
        <div className="string-tools">
          <div className="string-tools__top_section">
            <CodeWindow onInput={this.handleCodeWindowInput}
                        onSelect={this.handleCodeWindowSelect}
                        textUtilsService={this.textUtilsService} value={this.state.code} />
            <ExplainWindow explanation={this.state.explanation} />
          </div>
          <div className="panes-container">
            <InputPane onInput={this.handleInputPaneInput} value={this.state.input} />
            <OutputPane output={this.state.output} textUtilsService={this.textUtilsService} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
