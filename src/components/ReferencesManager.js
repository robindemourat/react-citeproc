import React, {Component} from 'react';
import PropTypes from 'prop-types';

const CSL = require('citeproc');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlToReactParser = new HtmlToReactParser();

class ReferencesManager extends Component {

  constructor(props) {
    super(props);
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

    this.makeReactBibliography = (processor, items) => {
      processor.updateItems(Object.keys(items));
      const bibResults = processor.makeBibliography();

      const biblioStr = bibResults[1].join('\n');
      return htmlToReactParser.parse(biblioStr);
    };

    this.makeReactCitations = (processor, cits) => {
      return cits.reduce((inputCitations, citationData) => {
        const citations = {...inputCitations};
        const citation = citationData[0];
        const citationsPre = citationData[1];
        const citationsPost = citationData[2];
        let citationObjects = processor.processCitationCluster(citation, citationsPre, citationsPost);
        citationObjects = citationObjects[1];
        citationObjects.forEach(cit => {
          const order = cit[0];
          const html = cit[1];
          const ThatComponent = htmlToReactParser.parse(cit[1]);
          const citationId = cit[2];
          citations[citationId] = {
            order,
            html,
            Component: ThatComponent
          };
        });
        return citations;
      }, {});
    };

    const processor = new CSL.Engine(sys, props.style);

    this.state = {
      sys,
      bibliography: props.items && props.style && props.locale ? this.makeReactBibliography(processor, props.items) : undefined,
      citations: props.citations && props.style && props.locale ? this.makeReactCitations(processor, props.citations) : undefined,
      citationStyle: props.citations && props.style,
      citationLocale: props.citations && props.locale,
    };
  }

  getChildContext() {
    return {
      bibliography: this.state.bibliography,
      citations: this.state.citations,
      citationStyle: this.props.style,
      citationLocale: this.props.locale,
    };
  }

  componentDidMount() {
    if (this.props.locale && this.props.style) {
      const processor = new CSL.Engine(this.state.sys, this.props.style);
      this.setState({
        processor,
        citations: this.props.citations && this.props.citations.length ? this.makeReactCitations(processor, this.props.citations) : undefined,
        bibliography: this.props.items && this.props.items.length ? this.makeReactBibliography(processor, this.props.items) : undefined,
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
    if (!this.props.items || !Object.keys(this.props.items).length) {
      return;
    }
    if (this.state.processor &&
      (this.props.items !== prevProps.items) ||
      (this.props.citations !== prevProps.citations) ||
      !this.state.bibliography) {
      this.setState({
        citations: this.props.citations && this.makeReactCitations(this.state.processor, this.props.citations),
        bibliography: this.makeReactBibliography(this.state.processor, this.props.items),
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
        citations: this.props.citations && this.makeReactCitations(processor, this.props.citations),
        bibliography: this.makeReactBibliography(processor, this.props.items),
        sys
      });
    }
    // handle style change
    if (this.props.style !== prevProps.style) {
      const processor = new CSL.Engine(this.state.sys, this.props.style);
      this.setState({
        processor,
        citations: this.props.citations && this.makeReactCitations(processor, this.props.citations),
        bibliography: this.makeReactBibliography(processor, this.props.items),
      });
    }
  }

  render () {
    const {
      componentClass,
      children
    } = this.props;

    return (<div className={componentClass}>{children}</div>);

  }
}

ReferencesManager.propTypes = {
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
  /**
   * array of citation arrays to use for building citations data
   * Each citation array represents the citation content and context as follows :
   * citation[0] : object containing the citations (with properties citationID (string), citationItems (array), and properties (object))
   * citation[1] : array of citations preceding the given citation ([0]: citationId, [1]: citation index)
   * citation[2] : array of citations following the given citation ([0]: citationId, [1]: citation index)
   */
  citations: PropTypes.array,
};

ReferencesManager.childContextTypes = {
  bibliography: PropTypes.array,
  citations: PropTypes.object,
  citationLocale: PropTypes.string,
  citationStyle: PropTypes.string,
};

export default ReferencesManager;
