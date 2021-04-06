import React, { ReactNode } from 'react';
import { TextUtilsService } from '../../services/text-utils.service';
import VerticalScrollbar from '../VerticalScrollbar/VerticalScrollbar';
import '../InputPane/InputPane.scss';
import '../OutputPane/OutputPane.scss';
import './ScrollViewer.scss';

interface ScrollViewerProps {
  height: number;
  lineHeight: number;
  containerClassName: string;
  textareaClassName: string;
  textUtilsService: TextUtilsService;
}

interface ScrollViewerState {
  scrollY: number;
  elementsInView: Array<Exclude<ReactNode, boolean | null | undefined>>;
}

// this.elements = array containing all the elements in the viewed component.
// this.props.elementsInView = array containing those elements which are in view.

class ScrollViewer extends React.Component<ScrollViewerProps, ScrollViewerState> {

  constructor(props: ScrollViewerProps) {
    super(props)

    this.state = {
      elementsInView: this.getElementsInView(0),
      scrollY: 0
    }

    this.getChildrenAsArray = this.getChildrenAsArray.bind(this);
    this.getElementsInView = this.getElementsInView.bind(this);

    this.getNumberOfLines = this.getNumberOfLines.bind(this);
    this.getNumberOfVisibleLines = this.getNumberOfVisibleLines.bind(this);
    this.getLengthOfVerticalScrollbar = this.getLengthOfVerticalScrollbar.bind(this);
    this.getPositionOfVerticalScrollbar = this.getPositionOfVerticalScrollbar.bind(this);

    this.downArrowClick = this.downArrowClick.bind(this);
    this.upArrowClick = this.upArrowClick.bind(this);
  }

  getChildrenAsArray(): Array<Exclude<ReactNode, boolean | null | undefined>> {

    return React.Children.toArray(this.props.children);
  }

  getElementsInView(scrollY: number): Array<Exclude<ReactNode, boolean | null | undefined>> {

    return this.getChildrenAsArray().slice(
      scrollY,
      scrollY + this.getNumberOfVisibleLines()
    );
  }

  getNumberOfLines(): number {

    return Math.max(this.getChildrenAsArray().length, this.getNumberOfVisibleLines());
  }

  getNumberOfVisibleLines(): number {

    return this.props.height / this.props.lineHeight;
  }

  getPositionOfVerticalScrollbar(): number {

    return 100.0 * this.state.scrollY / this.getNumberOfLines();
  }

  getLengthOfVerticalScrollbar(): number {

    return 100.0 * this.getNumberOfVisibleLines() / this.getNumberOfLines();
  }

  upArrowClick() {

    if (this.state.scrollY > 0) {
      this.setState({ scrollY: this.state.scrollY - 1 });
    }
  }

  downArrowClick() {

    this.setState({ scrollY: this.state.scrollY + 1 });
  }

  render() {
    
    return <div className={`scroll-viewer ${this.props.containerClassName}`}>
      <div className={`${this.props.textareaClassName} textarea`}>
        {this.getElementsInView(this.state.scrollY)}
      </div>
      <VerticalScrollbar 
        onUpArrowClick={this.upArrowClick}
        onDownArrowClick={this.downArrowClick}
        barPositionPercentage={this.getPositionOfVerticalScrollbar()}
        barLengthPercentage={this.getLengthOfVerticalScrollbar()}
      ></VerticalScrollbar>
    </div>;
  }
}

export default ScrollViewer;