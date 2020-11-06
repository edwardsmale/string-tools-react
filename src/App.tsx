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
  explanation: string;
  output: string;
}

class App extends React.Component<AppProps, AppState> {

  input: string;

  constructor(props: AppProps) {
    super(props)

    this.state = {
      explanation: "",
      output: ""
    }

    this.input = "blah blah blah";

    this.handleInputPaneInput = this.handleInputPaneInput.bind(this);
    this.handleCodeWindowInput = this.handleCodeWindowInput.bind(this);
  }

  handleInputPaneInput(input: string) {
    
    this.input = input;

    // TODO
    // Update output
  }

  handleCodeWindowInput(code: string) {
    // Dummy implementation - just copy code to explanation pane.
    //this.setState({explanation: code});

    // TODO
    // Update explanation
    // Update output
    
    const commandService = this.getCommandService();

    const result = commandService.processCommands(code, this.input, false);

    this.setState({ output: result.join("\r\n")});
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
            <CodeWindow onInput={this.handleCodeWindowInput} />
            <ExplainWindow explanation={this.state.explanation} />
          </div>
          <div className="panes-container">
            <InputPane onInput={this.handleInputPaneInput} />
            <OutputPane output={this.state.output} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
