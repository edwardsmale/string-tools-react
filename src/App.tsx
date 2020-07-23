import React from 'react';
import './App.scss';
import CodeWindow from './components/CodeWindow/CodeWindow';
import ExplainWindow from './components/ExplainWindow/ExplainWindow';
import InputPane from './components/InputPane/InputPane';
import OutputPane from './components/OutputPane/OutputPane';

function App() {
  return (
    <div className="App">
      <div className="string-tools">
        <div className="string-tools__top_section">
          <CodeWindow />
          <ExplainWindow />
        </div>
        <div className="panes-container">
          <InputPane />
          <OutputPane />
        </div>
      </div>
    </div>
  );
}

export default App;
