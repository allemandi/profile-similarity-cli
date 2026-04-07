import { describe, it, expect } from 'vitest';
import { getUsedFields } from '../utils/sanitizer';
import { findMentorshipGaps } from '../utils/mentorship';

describe('Sanitizer Utils', () => {
  it('should get used fields correctly', () => {
    const queryObj = { name: 'me', react: '8', node: '7', python: '4' };
    const dataObj = { name: 'alice', react: '9', node: '6', python: '3', extra: '10' };
    const fields = getUsedFields(queryObj, dataObj);
    expect(fields).toEqual(['react', 'node', 'python']);
  });
});

describe('Mentorship Utils', () => {
  it('should find mentorship gaps correctly with threshold 2', () => {
    const yourSkills = [8, 7, 4];
    const theirSkills = [9, 6, 8];
    const skillNames = ['react', 'node', 'python'];
    const gaps = findMentorshipGaps(yourSkills, theirSkills, skillNames, 2);
    expect(gaps).toEqual([
      { skill: 'python', yourLevel: 4, theirLevel: 8, gap: 4 }
    ]);
  });

  it('should find mentorship gaps correctly with threshold 1', () => {
    const yourSkills = [8, 7, 4];
    const theirSkills = [9, 6, 8];
    const skillNames = ['react', 'node', 'python'];
    const gaps = findMentorshipGaps(yourSkills, theirSkills, skillNames, 1);
    expect(gaps).toEqual([
      { skill: 'react', yourLevel: 8, theirLevel: 9, gap: 1 },
      { skill: 'python', yourLevel: 4, theirLevel: 8, gap: 4 }
    ]);
  });
});
