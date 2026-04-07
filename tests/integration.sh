#!/bin/bash
set -e

echo "Running Integration Tests..."

# Test peers command
echo "Testing 'peers' command..."
node index.js peers --query data/query-profile.csv --dataset data/dataset-profiles.csv --top-k 3 > /dev/null
echo "✔ 'peers' command executed successfully."

# Test mentors command
echo "Testing 'mentors' command..."
node index.js mentors --query data/query-profile.csv --dataset data/dataset-profiles.csv --min-gap 1 > /dev/null
echo "✔ 'mentors' command executed successfully."

echo "All Integration Tests Passed!"
