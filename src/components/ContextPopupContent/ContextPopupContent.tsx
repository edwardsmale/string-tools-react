import React from 'react';
import './ContextPopupContent.scss';
import { Context } from '../../interfaces/Context';

interface ContextPopupContentProps {
  context: Context;
}

interface ContextPopupContentState {
}

class ContextPopupContent extends React.Component<ContextPopupContentProps, ContextPopupContentState> {

  render() {
    
    return <div className="context-popup-content">
      <table cellPadding={3} cellSpacing={0}>
        <colgroup>
          <col width={100} />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <td className="context-popup-content__key">Is Array Of Arrays</td>
            <td className="context-popup-content__value">{this.props.context.isArrayOfArrays ? "True" : "False"}</td>
          </tr>
          <tr>
            <td className="context-popup-content__key">Search string</td>
            <td className="context-popup-content__value">{this.props.context.searchString}</td>
          </tr>
          <tr>
            <td className="context-popup-content__key">Regex</td>
            <td className="context-popup-content__value">{this.props.context.regex}</td>
          </tr>
          <tr>
            <td className="context-popup-content__separator" colSpan={2}></td>
          </tr>
          <tr>
            <td className="context-popup-content__post-separator" colSpan={2}></td>
          </tr>
          <tr>
            <td className="context-popup-content__key">Columns</td>
            <td className="context-popup-content__value">{this.props.context.columnInfo.numberOfColumns}</td>
          </tr>
          <tr>
            <td className="context-popup-content__key">Headers</td>
            <td className="context-popup-content__value">
              <table cellPadding={1} cellSpacing={0}>
                <tbody>
                  {this.props.context.columnInfo.headers?.map((header, index) => (<tr key={`${Math.random()}`}><td className="context-popup-content__Header">{header}</td></tr>))}
                </tbody>
              </table>
              
            </td>
          </tr>
          <tr>
            <td className="context-popup-content__key">With Indices</td>
            <td className="context-popup-content__value">{this.props.context.withIndices.join(", ")}</td>
          </tr>
        </tbody>
      </table>
        
    </div>;   
  }
}

export default ContextPopupContent;
