const { findMentorshipGaps } = require('../utils/mentorship');
const assert = require('assert');

const yourSkills = [8, 7, 4];
const theirSkills = [9, 6, 8];
const skillNames = ['react', 'node', 'python'];

const gaps = findMentorshipGaps(yourSkills, theirSkills, skillNames, 2);
assert.deepStrictEqual(gaps, [
  { skill: 'python', yourLevel: 4, theirLevel: 8, gap: 4 }
]);

const gaps2 = findMentorshipGaps(yourSkills, theirSkills, skillNames, 1);
assert.deepStrictEqual(gaps2, [
  { skill: 'react', yourLevel: 8, theirLevel: 9, gap: 1 },
  { skill: 'python', yourLevel: 4, theirLevel: 8, gap: 4 }
]);

console.log('Mentorship test passed!');
