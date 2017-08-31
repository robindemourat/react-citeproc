'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = makeBibliography;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CSL = require('citeproc');

function makeBibliography(items, style, locale) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  if (!style || !locale) {
    return;
  }
  var sys = {
    retrieveLocale: function retrieveLocale() {
      return locale;
    },
    retrieveItem: function retrieveItem(id) {
      return items[id];
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
  var processor = new CSL.Engine(sys, style);
  processor.updateItems((0, _keys2.default)(items));
  var bibResults = processor.makeBibliography(options);
  return bibResults;
}
module.exports = exports['default'];