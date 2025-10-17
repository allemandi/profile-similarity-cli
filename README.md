# profile-similarity-cli
CLI tool for profile recommendations using cosine similarity on CSV data

Quick Usage Example
```bash
// peers
node index.js peers --query data/query-profile.csv --dataset data/dataset-profiles.csv --top-k 3

// mentors
node index.js mentors --query data/query-profile.csv --dataset data/dataset-profiles.csv --min-gap 1
```