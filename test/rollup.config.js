import transformTaggedTemplate from '../esm/index.js';

export default {
	input: 'test/index.js',
	plugins: [
		transformTaggedTemplate({
			tagsToProcess: ['tagger'],
			transformer(data) {
				return data.trim();
			}
		})
	],
	output: {
		file: 'build/index.js'
	}
};
