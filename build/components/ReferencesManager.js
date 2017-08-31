'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CSL = require('citeproc');
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

var ReferencesManager = function (_Component) {
  (0, _inherits3.default)(ReferencesManager, _Component);

  function ReferencesManager(props) {
    (0, _classCallCheck3.default)(this, ReferencesManager);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ReferencesManager.__proto__ || (0, _getPrototypeOf2.default)(ReferencesManager)).call(this, props));

    var sys = {
      retrieveLocale: function retrieveLocale() {
        return _this.props.locale;
      },
      retrieveItem: function retrieveItem(id) {
        return _this.props.items[id];
      },
      variableWrapper: function variableWrapper(params, prePunct, str, postPunct) {
        if (params.variableNames[0] === 'title' && params.itemData.URL && params.context === 'bibliography') {
          return prePunct + '<a href="' + params.itemData.URL + '" target="blank">' + str + '</a>' + postPunct;
        } else {
          return prePunct + str + postPunct;
        }
      }
    };

    _this.makeReactBibliography = function (processor, items) {
      processor.updateItems((0, _keys2.default)(items));
      var bibResults = processor.makeBibliography();

      var biblioStr = bibResults[1].join('\n');
      return htmlToReactParser.parse(biblioStr);
    };

    _this.makeReactCitations = function (processor, cits) {
      return cits.reduce(function (inputCitations, citationData) {
        var citations = (0, _extends3.default)({}, inputCitations);
        var citation = citationData[0];
        var citationsPre = citationData[1];
        var citationsPost = citationData[2];
        var citationObjects = processor.processCitationCluster(citation, citationsPre, citationsPost);
        citationObjects = citationObjects[1];
        citationObjects.forEach(function (cit) {
          var order = cit[0];
          var html = cit[1];
          var ThatComponent = htmlToReactParser.parse(cit[1]);
          var citationId = cit[2];
          citations[citationId] = {
            order: order,
            html: html,
            Component: ThatComponent
          };
        });
        return citations;
      }, {});
    };

    var processor = new CSL.Engine(sys, props.style);

    _this.state = {
      sys: sys,
      bibliography: props.items && props.style && props.locale ? _this.makeReactBibliography(processor, props.items) : undefined,
      citations: props.citations && props.style && props.locale ? _this.makeReactCitations(processor, props.citations) : undefined,
      citationStyle: props.citations && props.style,
      citationLocale: props.citations && props.locale
    };
    return _this;
  }

  (0, _createClass3.default)(ReferencesManager, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        bibliography: this.state.bibliography,
        citations: this.state.citations,
        citationStyle: this.props.style,
        citationLocale: this.props.locale
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.locale && this.props.style) {
        var processor = new CSL.Engine(this.state.sys, this.props.style);
        this.setState({
          processor: processor,
          citations: this.props.citations && this.props.citations.length ? this.makeReactCitations(processor, this.props.citations) : undefined,
          bibliography: this.props.items && this.props.items.length ? this.makeReactBibliography(processor, this.props.items) : undefined
        });
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!this.state.processor && this.props.locale && this.props.style) {
        var processor = new CSL.Engine(this.state.sys, nextProps.style);
        this.setState({
          processor: processor
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      if (!this.props.items || !(0, _keys2.default)(this.props.items).length) {
        return;
      }
      if (this.state.processor && this.props.items !== prevProps.items || this.props.citations !== prevProps.citations || !this.state.bibliography) {
        this.setState({
          citations: this.props.citations && this.makeReactCitations(this.state.processor, this.props.citations),
          bibliography: this.makeReactBibliography(this.state.processor, this.props.items)
        });
      }
      if (this.props.locale !== prevProps.locale) {
        var sys = {
          retrieveLocale: function retrieveLocale() {
            return _this2.props.locale;
          },
          retrieveItem: function retrieveItem(id) {
            return _this2.props.items[id];
          },
          variableWrapper: function variableWrapper(params, prePunct, str, postPunct) {
            if (params.variableNames[0] === 'title' && params.itemData.URL && params.context === 'bibliography') {
              return prePunct + '<a href="' + params.itemData.URL + '" target="blank">' + str + '</a>' + postPunct;
            } else {
              return prePunct + str + postPunct;
            }
          }
        };
        var processor = new CSL.Engine(sys, this.props.style);
        this.setState({
          processor: processor,
          citations: this.props.citations && this.makeReactCitations(processor, this.props.citations),
          bibliography: this.makeReactBibliography(processor, this.props.items),
          sys: sys
        });
      }
      if (this.props.style !== prevProps.style) {
        var _processor = new CSL.Engine(this.state.sys, this.props.style);
        this.setState({
          processor: _processor,
          citations: this.props.citations && this.makeReactCitations(_processor, this.props.citations),
          bibliography: this.makeReactBibliography(_processor, this.props.items)
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          componentClass = _props.componentClass,
          children = _props.children;


      return _react2.default.createElement(
        'div',
        { className: componentClass },
        children
      );
    }
  }]);
  return ReferencesManager;
}(_react.Component);

ReferencesManager.propTypes = {
  componentClass: _propTypes2.default.string,
  style: _propTypes2.default.string,
  locale: _propTypes2.default.string,
  items: _propTypes2.default.object,
  citations: _propTypes2.default.array
};

ReferencesManager.childContextTypes = {
  bibliography: _propTypes2.default.array,
  citations: _propTypes2.default.object,
  citationLocale: _propTypes2.default.string,
  citationStyle: _propTypes2.default.string
};

exports.default = ReferencesManager;
module.exports = exports['default'];