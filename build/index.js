'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeBibliography = exports.ReferencesManager = exports.Bibliography = undefined;

var _Bibliography = require('./components/Bibliography');

var _Bibliography2 = _interopRequireDefault(_Bibliography);

var _ReferencesManager = require('./components/ReferencesManager');

var _ReferencesManager2 = _interopRequireDefault(_ReferencesManager);

var _makeBibliography = require('./utils/makeBibliography');

var _makeBibliography2 = _interopRequireDefault(_makeBibliography);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bibliography = exports.Bibliography = _Bibliography2.default;
var ReferencesManager = exports.ReferencesManager = _ReferencesManager2.default;
var makeBibliography = exports.makeBibliography = _makeBibliography2.default;