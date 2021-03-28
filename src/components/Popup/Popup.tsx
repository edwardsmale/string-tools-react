import React from 'react';
import './Popup.scss';

interface PopupProps {
  onClose(): any;
  title: string;
  init_left: number;
  init_top: number;
  init_right: number;
  init_bottom: number;
}

interface PopupState {
  x: number;
  y: number;
  w: number;
  h: number;
  dragTitleX: number | null;
  dragTitleY: number | null;
  dragResizeX: number | null;
  dragResizeY: number | null;
  topEdgeResizeY: number | null;
  bottomEdgeResizeY: number | null;
  leftEdgeResizeX: number | null;
  rightEdgeResizeX: number | null;
}

class Popup extends React.Component<PopupProps, PopupState> {
  constructor(props: PopupProps) {
    super(props);

    const left = this.props.init_left >= 0 ? this.props.init_left : this.props.init_left + window.innerWidth / 16;
    const top = this.props.init_top >= 0 ? this.props.init_top : this.props.init_top + window.innerHeight / 16;
    const right = this.props.init_right >= 0 ? this.props.init_right : this.props.init_right + window.innerWidth / 16;
    const bottom = this.props.init_bottom >= 0 ? this.props.init_bottom : this.props.init_bottom + window.innerHeight / 16;

    this.state = {
      x: left,
      y: top,
      w: right - left,
      h: bottom - top,
      dragTitleX: null,
      dragTitleY: null,
      dragResizeX: null,
      dragResizeY: null,
      topEdgeResizeY: null,
      bottomEdgeResizeY: null,
      leftEdgeResizeX: null,
      rightEdgeResizeX: null
    };

    this.onCloseClick = this.onCloseClick.bind(this);
    this.getMouseXRelativeToDiv = this.getMouseXRelativeToDiv.bind(this);
    this.getMouseYRelativeToDiv = this.getMouseYRelativeToDiv.bind(this);
    this.onTitleDragStart = this.onTitleDragStart.bind(this);
    this.onTitleDrag = this.onTitleDrag.bind(this);
    this.onTitleDragEnd = this.onTitleDragEnd.bind(this);
    this.onResizeDragStart = this.onResizeDragStart.bind(this);
    this.onResizeDrag = this.onResizeDrag.bind(this);
    this.onResizeDragEnd = this.onResizeDragEnd.bind(this);
    this.onTopEdgeDragStart = this.onTopEdgeDragStart.bind(this);
    this.onTopEdgeDrag = this.onTopEdgeDrag.bind(this);
    this.onTopEdgeDragEnd = this.onTopEdgeDragEnd.bind(this);
    this.onBottomEdgeDragStart = this.onBottomEdgeDragStart.bind(this);
    this.onBottomEdgeDrag = this.onBottomEdgeDrag.bind(this);
    this.onBottomEdgeDragEnd = this.onBottomEdgeDragEnd.bind(this);
    this.onLeftEdgeDragStart = this.onLeftEdgeDragStart.bind(this);
    this.onLeftEdgeDrag = this.onLeftEdgeDrag.bind(this);
    this.onLeftEdgeDragEnd = this.onLeftEdgeDragEnd.bind(this);
    this.onRightEdgeDragStart = this.onRightEdgeDragStart.bind(this);
    this.onRightEdgeDrag = this.onRightEdgeDrag.bind(this);
    this.onRightEdgeDragEnd = this.onRightEdgeDragEnd.bind(this);
  }

  onCloseClick() {
    this.props.onClose();
  }

  getMouseXRelativeToDiv(e: React.DragEvent<HTMLDivElement>) {
    return (e.clientX - e.currentTarget.getClientRects()[0].x) / 16;
  }

  getMouseYRelativeToDiv(e: React.DragEvent<HTMLDivElement>) {
    return (e.clientY - e.currentTarget.getClientRects()[0].y) / 16;
  }
  
  // Title dragging

  onTitleDragStart(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      dragTitleX: this.getMouseXRelativeToDiv(e),
      dragTitleY: this.getMouseYRelativeToDiv(e)
    });
  }

  onTitleDrag(e: React.DragEvent<HTMLDivElement>) {
    if (this.state.dragTitleX !== null && this.state.dragTitleY !== null) {
      if (e.clientX !== 0 || e.clientY !== 0) {
        const diffX = this.getMouseXRelativeToDiv(e) - this.state.dragTitleX;
        const diffY = this.getMouseYRelativeToDiv(e) - this.state.dragTitleY;
        this.setState({
          x: this.state.x + diffX,
          y: this.state.y + diffY
        });
      }
    }
  }

  onTitleDragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      dragTitleX: null,
      dragTitleY: null
    });
  } 
  
  // Resize triangle dragging

  onResizeDragStart(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      dragResizeX: this.getMouseXRelativeToDiv(e),
      dragResizeY: this.getMouseYRelativeToDiv(e)
    });
  }

  onResizeDrag(e: React.DragEvent<HTMLDivElement>) {
    if (this.state.dragResizeX !== null && this.state.dragResizeY !== null) {
      if (e.clientX !== 0 || e.clientY !== 0) {
        const diffX = this.getMouseXRelativeToDiv(e) - this.state.dragResizeX;
        const diffY = this.getMouseYRelativeToDiv(e) - this.state.dragResizeY;
        this.setState({
          w: this.state.w + diffX,
          h: this.state.h + diffY
        });
      }
    }
  }

  onResizeDragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      dragResizeX: null,
      dragResizeY: null
    });
  } 
  
  // Top edge dragging

  onTopEdgeDragStart(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      topEdgeResizeY: this.getMouseYRelativeToDiv(e)
    });
  }

  onTopEdgeDrag(e: React.DragEvent<HTMLDivElement>) {
    if (this.state.topEdgeResizeY !== null && e.clientY !== 0) {
      const diffY = this.state.topEdgeResizeY - this.getMouseYRelativeToDiv(e);
      this.setState({
        y: this.state.y - diffY,
        h: this.state.h + diffY
      });
    }
  }

  onTopEdgeDragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      topEdgeResizeY: null
    });
  } 
  
  // Bottom edge dragging

  onBottomEdgeDragStart(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      bottomEdgeResizeY: this.getMouseYRelativeToDiv(e)
    });
  }

  onBottomEdgeDrag(e: React.DragEvent<HTMLDivElement>) {
    if (this.state.bottomEdgeResizeY !== null && e.clientY !== 0) {
      const diffY = this.state.bottomEdgeResizeY - this.getMouseYRelativeToDiv(e);
      this.setState({
        h: this.state.h - diffY
      });
    }
  }

  onBottomEdgeDragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      bottomEdgeResizeY: null
    });
  }
  
  // Left edge dragging

  onLeftEdgeDragStart(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      leftEdgeResizeX: this.getMouseXRelativeToDiv(e)
    });
  }

  onLeftEdgeDrag(e: React.DragEvent<HTMLDivElement>) {
    if (this.state.leftEdgeResizeX !== null && e.clientX !== 0) {
      const diffX = this.state.leftEdgeResizeX - this.getMouseXRelativeToDiv(e);
      this.setState({
        x: this.state.x - diffX,
        w: this.state.w + diffX
      });
    }
  }

  onLeftEdgeDragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      leftEdgeResizeX: null
    });
  } 
  
  // Right edge dragging

  onRightEdgeDragStart(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      rightEdgeResizeX: this.getMouseXRelativeToDiv(e)
    });
  }

  onRightEdgeDrag(e: React.DragEvent<HTMLDivElement>) {
    if (this.state.rightEdgeResizeX !== null && e.clientX !== 0) {
      const diffX = this.getMouseXRelativeToDiv(e) - this.state.rightEdgeResizeX;
      this.setState({
        w: this.state.w + diffX
      });
    }
  }

  onRightEdgeDragEnd(e: React.DragEvent<HTMLDivElement>) {
    this.setState({
      rightEdgeResizeX: null
    });
  }

  render() {
    return <div className="popup" style={{
              left: this.state.x + "rem",
              top: this.state.y + "rem",
              width: this.state.w + 0.125 + "rem",
              height: this.state.h + "rem"
            }}>
          <div className="popup__left-edge" draggable onDragStart={this.onLeftEdgeDragStart} onDrag={this.onLeftEdgeDrag} onDragEnd={this.onLeftEdgeDragEnd}></div>
          <div className="popup__innards">
            <div className="popup__top-edge" draggable onDragStart={this.onTopEdgeDragStart} onDrag={this.onTopEdgeDrag} onDragEnd={this.onTopEdgeDragEnd}></div>
            <div className="popup__title" draggable onDragStart={this.onTitleDragStart} onDrag={this.onTitleDrag} onDragEnd={this.onTitleDragEnd}>{this.props.title}
              <div className="popup__close" onClick={this.onCloseClick}>&times;</div>
              </div>
              <div className="popup__text" style={{
                  width: this.state.w - 1 + "rem",
                  height: this.state.h - 4 + "rem"
                }}>{this.props.children}</div>
              <div className="popup__resize" draggable onDragStart={this.onResizeDragStart} onDrag={this.onResizeDrag} onDragEnd={this.onResizeDragEnd}>
                <div className="popup__resize-triangle"></div>
              </div>
            <div className="popup__bottom-edge" draggable onDragStart={this.onBottomEdgeDragStart} onDrag={this.onBottomEdgeDrag} onDragEnd={this.onBottomEdgeDragEnd}></div>
          </div>  
          <div className="popup__right-edge" draggable onDragStart={this.onRightEdgeDragStart} onDrag={this.onRightEdgeDrag} onDragEnd={this.onRightEdgeDragEnd}></div>
        </div>;
  }
}

export default Popup;