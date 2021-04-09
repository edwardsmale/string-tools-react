import React from 'react';
import './Scrollbar.scss';

interface ScrollbarProps {
  isVertical: boolean;
  isMouseDown: boolean;
  mousePos: number;
  contentLength: number;
  visibleLength: number;
  getScrollPosition: () => number; 
  setScrollPosition: (scrollPosition: number) => void;
}

interface ScrollbarState {
  mouseDownPos: number | null;
}

class Scrollbar extends React.Component<ScrollbarProps, ScrollbarState> {

  constructor(props: ScrollbarProps) {
    super(props)

    this.state = {
      mouseDownPos: null
    }

    this.enforceRange = this.enforceRange.bind(this);
    
    this.scroll = this.scroll.bind(this);
    this.scrollForward = this.scrollForward.bind(this);
    this.scrollForwardBig = this.scrollForwardBig.bind(this);
    this.scrollBackward = this.scrollBackward.bind(this);
    this.scrollBackwardBig = this.scrollBackwardBig.bind(this);

    this.onBarMouseDown = this.onBarMouseDown.bind(this);
    this.getLength = this.getLength.bind(this);
    this.getPosition = this.getPosition.bind(this);

    this.getGutterBeforeBarLength = this.getGutterBeforeBarLength.bind(this);
  }

  enforceRange(pos: number) {

    pos = Math.min(pos, this.props.contentLength - this.props.visibleLength);
    pos = Math.max(pos, 0);    

    return pos;
  }

  scroll(amt: number) {

    this.props.setScrollPosition(
      this.enforceRange(this.props.getScrollPosition() + amt)
    );
  }

  scrollForward() { this.scroll(1); }
  scrollForwardBig() { this.scroll(20); }
  scrollBackward() { this.scroll(-1); }
  scrollBackwardBig() { this.scroll(-20); }

  onBarMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {

    e.preventDefault();

    this.setState({ mouseDownPos: this.props.mousePos });
  }

  getLength() { 
    
    return 100.0 * this.props.visibleLength / this.props.contentLength;
  }

  private lastPosition: number | undefined;

  getPosition(mousePos: number, isMouseDown: boolean) {

    if (this.state.mouseDownPos !== null) {

      const diff = 
        (mousePos - this.state.mouseDownPos) * 
        this.props.visibleLength / (this.props.contentLength - this.props.visibleLength);

      // If mouse has just been released, perform the scroll to the new position.

      if (!isMouseDown) {

        this.scroll(diff);

        this.setState({ mouseDownPos: null });

        return this.enforceRange(this.props.getScrollPosition());
      }
      else {

        return this.enforceRange(this.props.getScrollPosition() + diff);
      }
    }

    return this.enforceRange(this.props.getScrollPosition());
  }

  getGutterBeforeBarLength() {

    return this.getPosition(this.props.mousePos, this.props.isMouseDown);
  }

  render () {  
    return (
      <div className={`scrollbar ${this.props.isVertical ? "scrollbar--vertical" : "scrollbar--horizontal"}`}>
        <div className="scrollbar__backward-arrow" onClick={this.scrollBackward}></div>
        <div className="scrollbar__gutter">

          <div className="scrollbar__gutter-before-bar"
              onClick={this.scrollBackwardBig} 
              style={{ flexBasis: this.getGutterBeforeBarLength() + "%" }}></div>

          <div className="scrollbar__gutter-bar" 
            onMouseDown={this.onBarMouseDown}
            style={{ flexBasis: this.getLength() + "%" }}></div>
            
          <div className="scrollbar__gutter-after-bar" onClick={this.scrollForwardBig}></div>
        </div>
        <div className="scrollbar__forward-arrow" onClick={this.scrollForward}></div>
      </div>
    );
  }
};

export default Scrollbar;