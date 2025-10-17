/**
 * Finds mentorship gaps between two sets of skills.
 * @param {Array<number>} yourSkills - Your skills embedding.
 * @param {Array<number>} theirSkills - Their skills embedding.
 * @param {Array<string>} skillNames - The names of the skills.
 * @param {number} [threshold=2] - The minimum gap to be considered a mentorship opportunity.
 * @returns {Array<Object>} - An array of mentorship gaps.
 */
function findMentorshipGaps(yourSkills, theirSkills, skillNames, threshold = 2) {
  const gaps = [];
  for (let i = 0; i < yourSkills.length; i++) {
    if (theirSkills[i] - yourSkills[i] >= threshold) {
      gaps.push({
        skill: skillNames[i],
        yourLevel: yourSkills[i],
        theirLevel: theirSkills[i],
        gap: theirSkills[i] - yourSkills[i],
      });
    }
  }
  return gaps;
}

module.exports = { findMentorshipGaps };
