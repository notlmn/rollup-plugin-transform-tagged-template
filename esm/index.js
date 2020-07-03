import {parse} from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

export function transformTaggedContent(content, options = {}) {
	const {
		parserOptions = {},
		tagsToProcess = [],
		transformer = code => code
	} = options;

	const ast = parse(content, parserOptions);

	traverse(ast, {
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

	return generate(ast);
}

export default function transformTaggedTemplate(options) {
	return {
		name: 'transform-tagged-template',
		transform(content) {
			return transformTaggedContent(content, options);
		}
	};
}
