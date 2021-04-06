import React from 'react';
import './VerticalScrollbar.scss';

interface VerticalScrollbarProps {
  barPositionPercentage: number;
  barLengthPercentage: number;
  onUpArrowClick(): any;
  onDownArrowClick(): any;
  onUpGutterClick(): any;
  onDownGutterClick(): any;
}

interface VerticalScrollbarState {
}

class VerticalScrollbar extends React.Component<VerticalScrollbarProps, VerticalScrollbarState> {

  constructor(props: VerticalScrollbarProps) {
    super(props)
  }

  render () {  
    return (
        <div className="vertical-scrollbar">
        <div className="vertical-scrollbar__up-arrow" onClick={this.props.onUpArrowClick}></div>
        <div className="vertical-scrollbar__gutter">
          <div className="vertical-scrollbar__gutter-above-bar" onClick={this.props.onUpGutterClick} style={{ flexBasis: this.props.barPositionPercentage + "%" }}></div>
          <div className="vertical-scrollbar__gutter-bar" style={{ flexBasis: this.props.barLengthPercentage + "%" }}></div>
          <div className="vertical-scrollbar__gutter-below-bar" onClick={this.props.onDownGutterClick}></div>
        </div>
        <div className="vertical-scrollbar__down-arrow" onClick={this.props.onDownArrowClick}></div>
      </div>
    );
  }
};

export default VerticalScrollbar;