import React, {Component} from 'react';

const CSL = require('citeproc');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();

class Bibliography extends Component {

  constructor(props) {
    super(props);
    this.state = {
      bibliography: '',
      sys: {
        retrieveLocale: () => {
          return this.props.locale;
        },
        retrieveItem: (id) => {
          return this.props.items[id];
        }
      }
    };

    this.makeReactBibliography = (processor, items) => {
      processor.updateItems(Object.keys(items));
      const bibResults = processor.makeBibliography();
      const biblioStr = bibResults[1].join('\n');
      return htmlToReactParser.parse(biblioStr);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.processor && this.props.locale && this.props.style) {
      const processor = new CSL.Engine(this.state.sys, nextProps.style);
      this.setState({
        processor
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.processor && (this.props.items !== prevProps.items) || !this.state.bibliography) {
      this.setState({
        bibliography: this.makeReactBibliography(this.state.processor, this.props.items) // htmlToReactParser.parse(biblioStr)
      });
    }
    // handle locale change
    if (this.props.locale !== prevProps.locale) {
      const sys = {
        retrieveLocale: () => {
          return this.props.locale;
        },
        retrieveItem: (id) => {
          return this.props.items[id];
        }
      };
      const processor = new CSL.Engine(sys, this.props.style);
      this.setState({
        processor,
        bibliography: this.makeReactBibliography(processor, this.props.items),
        sys
      });
    }
    // handle style change
    if (this.props.style !== prevProps.style) {
      const processor = new CSL.Engine(this.state.sys, this.props.style);
      this.setState({
        processor,
        bibliography: this.makeReactBibliography(processor, this.props.items),
      });
    }
  }
  render () {
    const {
      componentClass = 'Bibliography'
    } = this.props;
    const {
      bibliography
    } = this.state;

    if (bibliography) {
      return (<section className={componentClass}>{bibliography}</section>);
    }
 else {
      return (<section className={componentClass + ' loading'}>{this.props.loadingContent || 'loading'}</section>);
    }
  }
}

export default Bibliography;
