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
  output: string;
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props)

    const code = `search Edward
match`;

  const explanation = "";

  const input = `1,W11111,Edward,Smale,Leighton Buzzard
1,W11112,Edward,Smale,Sheffield
2,W22222,Stephen,Smale,Sheffield
3,W33333,Jo,Smale,Roehampton
4,W44444,Jo,Burton,Barnes
5,W55555,Edward,Burton,London`;

    const output = this.executeCommands(input, code);

    this.state = {
      code: code,
      explanation: explanation,
      input: input,
      output: output
    };

    this.handleInputPaneInput = this.handleInputPaneInput.bind(this);
    this.handleCodeWindowInput = this.handleCodeWindowInput.bind(this);
    this.executeCommands = this.executeCommands.bind(this);
  }

  handleInputPaneInput(input: string) {
    
    this.setState({input: input});
  }

  handleCodeWindowInput(code: string) {
        
    this.setState({code: code, output: code});

    let result = this.executeCommands(this.state.input, code);

    this.setState({ output: result });
  }

  private executeCommands(input: string, code: string): string {

    const commandService = this.getCommandService();

    const result = commandService.processCommands(code, input,false);

    return result.join("\r\n");
  }

  getCommandService(): CommandService {

    let textUtilsService = new TextUtilsService();
    let sortService = new SortService(textUtilsService);
    let commandTypesService = new CommandTypesService(textUtilsService, sortService);
    let commandParsingService = new CommandParsingService(textUtilsService, commandTypesService);
    return new CommandService(textUtilsService, commandParsingService, commandTypesService);
  }

  render() {
    return (
      <div className="App">
        <div className="string-tools">
          <div className="string-tools__top_section">
            <CodeWindow onInput={this.handleCodeWindowInput} value={this.state.code} />
            <ExplainWindow explanation={this.state.explanation} />
          </div>
          <div className="panes-container">
            <InputPane onInput={this.handleInputPaneInput} value={this.state.input} />
            <OutputPane output={this.state.output} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
