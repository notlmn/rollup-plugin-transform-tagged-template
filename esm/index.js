import babelParser from '@babel/parser';
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import * as rollup from 'rollup';

const {parse, ParserOptions} = babelParser;

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
export function transformTaggedContent(content, options = {}) {
	const {
		parserOptions = {},
		tagsToProcess = [],
		transformer = defaultTransformer,
	} = options;

	const ast = parse(content, parserOptions);

	traverse.default(ast, {
		TaggedTemplateExpression(path) {
			if (tagsToProcess.includes(path.node.tag.name)) {
				for (const quasi of path.node.quasi.quasis) {
					const transformedData = transformer(quasi.value.raw);
					quasi.value.raw = transformedData;
					quasi.value.cooked = transformedData;
				}
			}
		},
	});

	return generate.default(ast);
}

/**
 * @type {rollup.Plugin}
 * @param {TransformerOptions} [options={}]
 */
export default function transformTaggedTemplate(options = {}) {
	return {
		name: 'transform-tagged-template',
		transform(content) {
			return transformTaggedContent(content, options);
		},
	};
}
