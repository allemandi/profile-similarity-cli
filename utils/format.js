const pad = (s, l, right=false) => right ? s + ' '.repeat(l-String(s).length) : ' '.repeat(l-String(s).length) + s;

const formatMatchOutput = (results, queryProfile, fields) => {
  console.log('Top Matches\n============\n');
  for (const [i,r] of results.entries()) {
    console.log(`#${i+1} ${r.label}  (Similarity: ${(+r.similarityScore).toFixed(3)})`);
    console.log('-'.repeat(50));
    for (const f of fields) {
      const qv = queryProfile[f], pv = r.row[f], diff = pv-qv, tag = diff===0?'EXACT':'';
      const sign = diff > 0 ? '+' : '';
      console.log(`  ${pad(f,20)}${pad(qv,3)} -> ${pad(pv,3)}   ${pad(`(${sign}${diff})`,6,true)}${tag?`   ${tag}`:''}`)
    }
    console.log('-'.repeat(50)+'\n');
  }
};

module.exports = { pad, formatMatchOutput };
