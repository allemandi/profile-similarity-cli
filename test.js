const assert = require('node:assert');
const { execSync } = require('node:child_process');
const { getUsedFields } = require('./utils/sanitizer');
const { findMentorshipGaps } = require('./utils/mentorship');

console.log('Running Simplified Tests...');

// 1. Unit Tests: Sanitizer
const queryObj = { name: 'me', react: '8', node: '7' };
const dataObj = { name: 'alice', react: '9', node: '6', extra: '10' };
assert.deepStrictEqual(getUsedFields(queryObj, dataObj), ['react', 'node']);
console.log('✔ Sanitizer unit test passed.');

// 2. Unit Tests: Mentorship
const yourSkills = [8, 4];
const theirSkills = [9, 8];
const skillNames = ['react', 'python'];
const gaps = findMentorshipGaps(yourSkills, theirSkills, skillNames, 2);
assert.deepStrictEqual(gaps, [{ skill: 'python', yourLevel: 4, theirLevel: 8, gap: 4 }]);
console.log('✔ Mentorship unit test passed.');

// 3. Integration Tests: CLI
const run = cmd => execSync(`node index.js ${cmd}`, { stdio: 'pipe' }).toString();

assert.ok(run('peers --query data/query-profile.csv --dataset data/dataset-profiles.csv --top-k 1').includes('Top Matches'));
console.log('✔ CLI peers integration test passed.');

assert.ok(run('mentors --query data/query-profile.csv --dataset data/dataset-profiles.csv --min-gap 1').includes('Top Mentors'));
console.log('✔ CLI mentors integration test passed.');

console.log('All tests passed successfully!');
