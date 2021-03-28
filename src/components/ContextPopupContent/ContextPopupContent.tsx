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
    
    return <div className="ContextPopupContent">
      <table cellPadding={3} cellSpacing={0}>
        <colgroup>
          <col width={100} />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <td className="ContextPopupContent__Key">Search string</td>
            <td className="ContextPopupContent__Value">{this.props.context.searchString}</td>
          </tr>
          <tr>
            <td className="ContextPopupContent__Key">Regex</td>
            <td className="ContextPopupContent__Value">{this.props.context.regex}</td>
          </tr>
          <tr>
            <td className="ContextPopupContent__Separator" colSpan={2}></td>
          </tr>
          <tr>
            <td className="ContextPopupContent__PostSeparator" colSpan={2}></td>
          </tr>
          <tr>
            <td className="ContextPopupContent__Key">Columns</td>
            <td className="ContextPopupContent__Value">{this.props.context.columnInfo.numberOfColumns}</td>
          </tr>
          <tr>
            <td className="ContextPopupContent__Key">Headers</td>
            <td className="ContextPopupContent__Value">
              <table cellPadding={1} cellSpacing={0}>
                <tbody>
                  {this.props.context.columnInfo.headers?.map((header, index) => (<tr><td className="ContextPopupContent__Header">{header}</td></tr>))}
                </tbody>
              </table>
              
            </td>
          </tr>
        </tbody>
      </table>
        
    </div>;   
  }
}

export default ContextPopupContent;
