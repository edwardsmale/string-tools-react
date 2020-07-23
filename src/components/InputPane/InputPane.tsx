import React from 'react';
import './InputPane.scss';

const InputPane: React.FC = () => (
  <div className="pane pane--left">
    <textarea className="string-tools__textarea pane-textarea"
              placeholder="Paste the text to process in here" defaultValue={`1,W11111,Edward,Smale,Leighton Buzzard
1,W11112,Edward,Smale,Sheffield
2,W22222,Stephen,Smale,Sheffield
3,W33333,Jo,Smale,Roehampton
4,W44444,Jo,Burton,Barnes
5,W55555,Edward,Burton,London`}>

    </textarea>
  </div>
);

export default InputPane;
