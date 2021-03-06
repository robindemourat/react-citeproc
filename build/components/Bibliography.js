'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _citeproc = require('citeproc');

var _citeproc2 = _interopRequireDefault(_citeproc);

var _htmlToReact = require('html-to-react');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var htmlToReactParser = new _htmlToReact.Parser();

var Bibliography = function (_Component) {
  (0, _inherits3.default)(Bibliography, _Component);

  function Bibliography(props) {
    (0, _classCallCheck3.default)(this, Bibliography);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Bibliography.__proto__ || (0, _getPrototypeOf2.default)(Bibliography)).call(this, props));

    _this.makeReactBibliography = function (processor, items) {
      processor.updateItems((0, _keys2.default)(items));
      var bibResults = processor.makeBibliography();
      var biblioStr = bibResults[1].join('\n');
      return htmlToReactParser.parse(biblioStr);
    };

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
        } else if (params.variableNames[0] === 'URL') {
          return prePunct + '<a href="' + str + '" target="blank">' + str + '</a>' + postPunct;
        } else {
          return prePunct + str + postPunct;
        }
      }
    };

    var processor = new _citeproc2.default.Engine(sys, props.style);

    _this.state = {
      sys: sys,
      bibliography: props.items && props.style && props.locale ? _this.makeReactBibliography(processor, props.items) : ''
    };
    return _this;
  }

  (0, _createClass3.default)(Bibliography, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.locale && this.props.style) {
        var processor = new _citeproc2.default.Engine(this.state.sys, this.props.style);
        this.setState({
          processor: processor,
          bibliography: this.props.items && this.makeReactBibliography(processor, this.props.items)
        });
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!this.state.processor && this.props.locale && this.props.style) {
        var processor = new _citeproc2.default.Engine(this.state.sys, nextProps.style);
        this.setState({
          processor: processor
        });
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      if (this.state.processor && this.props.items !== prevProps.items || !this.state.bibliography) {
        this.setState({
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
            } else if (params.variableNames[0] === 'URL') {
              return prePunct + '<a href="' + str + '" target="blank">' + str + '</a>' + postPunct;
            } else {
              return prePunct + str + postPunct;
            }
          }
        };
        var processor = new _citeproc2.default.Engine(sys, this.props.style);
        this.setState({
          processor: processor,
          bibliography: this.makeReactBibliography(processor, this.props.items),
          sys: sys
        });
      }
      if (this.props.style !== prevProps.style) {
        var _processor = new _citeproc2.default.Engine(this.state.sys, this.props.style);
        this.setState({
          processor: _processor,
          bibliography: this.makeReactBibliography(_processor, this.props.items)
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props$componentClass = this.props.componentClass,
          componentClass = _props$componentClass === undefined ? 'Bibliography' : _props$componentClass;
      var bibliography = this.state.bibliography;


      if (bibliography) {
        return _react2.default.createElement(
          'div',
          { className: componentClass },
          bibliography
        );
      } else {
        return _react2.default.createElement(
          'div',
          { className: componentClass + ' loading' },
          this.props.loadingContent || 'loading'
        );
      }
    }
  }]);
  return Bibliography;
}(_react.Component);

Bibliography.propTypes = {
  componentClass: _propTypes2.default.string,
  style: _propTypes2.default.string,
  locale: _propTypes2.default.string,
  items: _propTypes2.default.object
};

exports.default = Bibliography;
module.exports = exports['default'];