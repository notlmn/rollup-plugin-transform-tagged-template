"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformTaggedContent = transformTaggedContent;
exports.default = transformTaggedTemplate;

var _parser = require("@babel/parser");

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _generator = _interopRequireDefault(require("@babel/generator"));

var rollup = _interopRequireWildcard(require("rollup"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string} code
 * @returns {string}
 */
function defaultTransformer(code) {
  return code;
}
/**
 * @typedef {Object} TransformerOptions
 * @property {ParserOptions} [parserOptions={}] - Parser options for Babel
 * @property {string[]} [tagsToProcess=[]] - List of named template tags to process
 * @property {defaultTransformer} [transformer] - Callback function for handling piece of code
 */

/**
 * @param {string} content
 * @param {TransformerOptions} [options={}]
 * @returns {string}
 */


function transformTaggedContent(content, options = {}) {
  const {
    parserOptions = {},
    tagsToProcess = [],
    transformer = defaultTransformer
  } = options;
  const ast = (0, _parser.parse)(content, parserOptions);
  (0, _traverse.default)(ast, {
    TaggedTemplateExpression(path) {
      if (tagsToProcess.includes(path.node.tag.name)) {
        for (const quasi of path.node.quasi.quasis) {
          const transformedData = transformer(quasi.value.raw);
          quasi.value.raw = transformedData;
          quasi.value.cooked = transformedData;
        }
      }
    }

  });
  return (0, _generator.default)(ast);
}
/**
 * @type {rollup.Plugin}
 * @param {TransformerOptions} [options={}]
 */


function transformTaggedTemplate(options = {}) {
  return {
    name: 'transform-tagged-template',

    transform(content) {
      return transformTaggedContent(content, options);
    }

  };
}