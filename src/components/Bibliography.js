import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CSL from 'citeproc';

import {Parser as HtmlToReactParser} from 'html-to-react';

const htmlToReactParser = new HtmlToReactParser();

class Bibliography extends Component {

  constructor(props) {
    super(props);


    this.makeReactBibliography = (processor, items) => {
      processor.updateItems(Object.keys(items));
      const bibResults = processor.makeBibliography();
      const biblioStr = bibResults[1].join('\n');
      return htmlToReactParser.parse(biblioStr);
    };

    const sys = {
      retrieveLocale: () => {
        return this.props.locale;
      },
      retrieveItem: (id) => {
        return this.props.items[id];
      },
      variableWrapper: (params, prePunct, str, postPunct) => {
        if (params.variableNames[0] === 'title'
            && params.itemData.URL
            && params.context === 'bibliography') {
          return prePunct
             + '<a href="'
               + params.itemData.URL
             + '" target="blank">'
               + str
             + '</a>'
               + postPunct;
        }
  else if (params.variableNames[0] === 'URL') {
          return prePunct
             + '<a href="'
               + str
             + '" target="blank">'
               + str
             + '</a>'
               + postPunct;
        }
        else {
          return (prePunct + str + postPunct);
        }
      }
    };

    const processor = new CSL.Engine(sys, props.style);

    this.state = {
      sys,
      bibliography: props.items && props.style && props.locale ? this.makeReactBibliography(processor, props.items) : '',
    };
  }

  componentDidMount() {
    if (this.props.locale && this.props.style) {
      const processor = new CSL.Engine(this.state.sys, this.props.style);
      this.setState({
        processor,
        bibliography: this.props.items && this.makeReactBibliography(processor, this.props.items)
      });
    }
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
        },
        variableWrapper: (params, prePunct, str, postPunct) => {
          if (params.variableNames[0] === 'title'
              && params.itemData.URL
              && params.context === 'bibliography') {
            return prePunct
               + '<a href="'
                 + params.itemData.URL
               + '" target="blank">'
                 + str
               + '</a>'
                 + postPunct;
          }
  else if (params.variableNames[0] === 'URL') {
            return prePunct
               + '<a href="'
                 + str
               + '" target="blank">'
                 + str
               + '</a>'
                 + postPunct;
          }
          else {
            return (prePunct + str + postPunct);
          }
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
      return (<div className={componentClass}>{bibliography}</div>);
    }
    else {
      return (<div className={componentClass + ' loading'}>{this.props.loadingContent || 'loading'}</div>);
    }
  }
}

Bibliography.propTypes = {
  /**
   * The class to use for identifying the component
   */
  componentClass: PropTypes.string,
  /**
   * Serialized csl data to use for styling the bibliography
   */
  style: PropTypes.string,
  /**
   * Serialized csl data to use for localizing the terms
   */
  locale: PropTypes.string,
  /**
   * csl-json bibliographic items to represent - keys stand for items ids, values are js objects
   */
  items: PropTypes.object,
};

export default Bibliography;
