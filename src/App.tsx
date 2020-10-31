import React from 'react';
import './App.scss';
import CodeWindow from './components/CodeWindow/CodeWindow';
import ExplainWindow from './components/ExplainWindow/ExplainWindow';
import InputPane from './components/InputPane/InputPane';
import OutputPane from './components/OutputPane/OutputPane';

interface AppProps {
}

interface AppState {
  explanation: string;
  output: string;
}

class App extends React.Component<AppProps, AppState> {

  constructor(props: AppProps) {
    super(props)

    this.state = {
      explanation: "",
      output: ""
    }

    this.handleInputPaneInput = this.handleInputPaneInput.bind(this);
    this.handleCodeWindowInput = this.handleCodeWindowInput.bind(this);
  }

  handleInputPaneInput(input: string) {
    // Dummy implementation - just copy input to output pane.
    //this.setState({output: input});

    // TODO
    // Update output
  }

  handleCodeWindowInput(code: string) {
    // Dummy implementation - just copy code to explanation pane.
    //this.setState({explanation: code});

    // TODO
    // Update explanation
    // Update output
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
