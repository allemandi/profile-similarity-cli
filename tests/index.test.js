const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');
const { getUsedFields } = require('../utils/sanitizer');
const { findMentorshipGaps } = require('../utils/mentorship');

test('Sanitizer Utils', async t => {
  await t.test('should get used fields correctly', () => {
    const queryObj = { name: 'me', react: '8', node: '7', python: '4' };
    const dataObj = { name: 'alice', react: '9', node: '6', python: '3', extra: '10' };
    const fields = getUsedFields(queryObj, dataObj);
    assert.deepStrictEqual(fields, ['react', 'node', 'python']);
  });
});

test('Mentorship Utils', async t => {
  await t.test('should find mentorship gaps correctly with threshold 2', () => {
    const yourSkills = [8, 7, 4];
    const theirSkills = [9, 6, 8];
    const skillNames = ['react', 'node', 'python'];
    const gaps = findMentorshipGaps(yourSkills, theirSkills, skillNames, 2);
    assert.deepStrictEqual(gaps, [
      { skill: 'python', yourLevel: 4, theirLevel: 8, gap: 4 }
    ]);
  });

  await t.test('should find mentorship gaps correctly with threshold 1', () => {
    const yourSkills = [8, 7, 4];
    const theirSkills = [9, 6, 8];
    const skillNames = ['react', 'node', 'python'];
    const gaps = findMentorshipGaps(yourSkills, theirSkills, skillNames, 1);
    assert.deepStrictEqual(gaps, [
      { skill: 'react', yourLevel: 8, theirLevel: 9, gap: 1 },
      { skill: 'python', yourLevel: 4, theirLevel: 8, gap: 4 }
    ]);
  });
});

test('CLI Integration', async t => {
  await t.test('peers command should run without error', () => {
    const output = execSync('node index.js peers --query data/query-profile.csv --dataset data/dataset-profiles.csv --top-k 3').toString();
    assert.ok(output.includes('Top Matches'));
    assert.ok(output.includes('#1 alice'));
  });

  await t.test('mentors command should run without error', () => {
    const output = execSync('node index.js mentors --query data/query-profile.csv --dataset data/dataset-profiles.csv --min-gap 1').toString();
    assert.ok(output.includes('Top Mentors'));
    assert.ok(output.includes('#1 alice'));
  });
});
