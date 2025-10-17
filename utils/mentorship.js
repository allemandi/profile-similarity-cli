function findMentorshipGaps(yourSkills, theirSkills, skillNames, threshold = 2) {
  const gaps = [];
  for (let i = 0; i < yourSkills.length; i++) {
    if (theirSkills[i] - yourSkills[i] >= threshold) {
      gaps.push({
        skill: skillNames[i],
        yourLevel: yourSkills[i],
        theirLevel: theirSkills[i],
        gap: theirSkills[i] - yourSkills[i]
      });
    }
  }
  return gaps;
}

module.exports = { findMentorshipGaps };
