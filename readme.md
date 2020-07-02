# rollup-plugin-transform-tagged-template

> Apply transformations on contents of [tagged template string literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), aka. template strings aka. template literals.

[![npm](https://img.shields.io/npm/v/rollup-plugin-transform-tagged-template)](https://www.npmjs.com/package/rollup-plugin-transform-tagged-template)

## Usage

``` js
// rollup.config.js
import transformTaggedTemplate from 'rollup-plugin-transform-tagged-template';

export default {
	input: 'test.js',
	plugins: [
		transformTaggedTemplate({
			tagsToProcess: ['css'],
			transformer(data) {
				// Spaces before and after these characters
				data = data.replace(/\s*([{}()>~+=^$:!;])\s*/gm, '$1');

				// Spaces only after these characters
				data = data.replace(/([",\[\]])\s+/gm, '$1');

				// You only need one space consequent in CSS
				data = data.replace(/\s{2,}/gm, ' ');

				return data.trim();
			}
		})
	],
	output: {
		file: 'build.js'
	}
};
```

## API

### `tagsToProces: string[]`

Refers to the tag names that are to be processed. In the example above, `css` is the tag that is processed.

Example: `tagsToProcess: ['handleCSS']` would target the following template literal.

``` js
const result = handleCSS`
	:host {
		display: block;
	}
`;
```

### `transformer: (string) => string`

Does what it says, one-to-one mapping of part of a template string.

> This could sometimes be only part of what you are expecting to get as argument. See example below.

Example:

``` js
// code.js
const declaration = handleCSS`color: #212121;`;
const result = handleCSS`
	:host {
		display: block;
		${declaration}
	}
`;
```

``` js
// rollup.js
	// ...
	plugins: [
		transformTaggedTemplate({
			tagsToProcess: ['handleCSS'],
			transformer(data) {
                console.log(data);
				return data;
			}
		})
	],
	// ...

// Output
[
	'color: #212121;',
	'\n\t:host {\n\t\tdisplay: block;\n\t\t',
	'\n\t\t}\n',
]
```

## Related

- [rollup-plugin-minify-tagged-css-template](https://github.com/notlmn/rollup-plugin-minify-tagged-css-template) - Rollup plugin to minify CSS content of tagged template string literals.

## License

[MIT](license) &copy; Laxman Damera
