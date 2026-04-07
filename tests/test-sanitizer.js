const { getUsedFields } = require('../utils/sanitizer');
const assert = require('assert');

const queryObj = { name: 'me', react: '8', node: '7', python: '4' };
const dataObj = { name: 'alice', react: '9', node: '6', python: '3', extra: '10' };

const fields = getUsedFields(queryObj, dataObj);
assert.deepStrictEqual(fields, ['react', 'node', 'python']);
console.log('Sanitizer test passed!');
