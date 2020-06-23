"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformTaggedContent = transformTaggedContent;
exports.default = transformTaggedTemplate;

var _parser = require("@babel/parser");

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _generator = _interopRequireDefault(require("@babel/generator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformTaggedContent(content, options = {}) {
  const {
    tagsToProcess = [],
    transformer = code => code
  } = options;
  const ast = (0, _parser.parse)(content);
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

function transformTaggedTemplate(options) {
  return {
    name: 'transform-tagged-template',

    transform(content) {
      return transformTaggedContent(content, options);
    }

  };
}