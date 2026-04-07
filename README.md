# 📦 profile-similarity-cli

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Node.js CLI tool for finding similar profiles and potential mentors from a CSV dataset. This tool uses cosine similarity to compare profiles based on their skills and experience.

## 🚀 Features

-   **Find Peers**: Find similar profiles based on your own profile.
-   **Find Mentors**: Discover potential mentors who have skills you want to learn.
-   **Customizable**: Easily customize the number of matches and the minimum skill gap for mentorship.
-   **Easy to Use**: Simple and intuitive command-line interface.

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/allemandi/profile-similarity-cli.git
    ```
2.  Install the dependencies:
    ```bash
    cd profile-similarity-cli
    yarn install
    ```

## Usage

### Find Peers

To find profiles similar to yours, use the `peers` command:

```bash
node index.js peers --query <your-profile.csv> --dataset <dataset.csv> [--top-k <number>]
```

-   `--query`: Path to your profile CSV file.
-   `--dataset`: Path to the dataset of profiles to compare against.
-   `--top-k` (optional): The number of similar profiles to return (default: 5).

**Example:**

```bash
node index.js peers --query data/query-profile.csv --dataset data/dataset-profiles.csv --top-k 3
```

### Find Mentors

To find potential mentors, use the `mentors` command:

```bash
node index.js mentors --query <your-profile.csv> --dataset <dataset.csv> [--top-k <number>] [--min-gap <number>]
```

-   `--query`: Path to your profile CSV file.
-   `--dataset`: Path to the dataset of profiles to compare against.
-   `--top-k` (optional): The number of mentors to return (default: 5).
-   `--min-gap` (optional): The minimum skill gap required for a mentorship recommendation (default: 2).

**Example:**

```bash
node index.js mentors --query data/query-profile.csv --dataset data/dataset-profiles.csv --min-gap 1
```

## 🧪 Testing

To run the test suite, use the following command:

```bash
yarn test
```

This will run unit tests for the core logic (using Vitest) and integration tests for the CLI commands.

## ⚙️ CI Pipeline

This project uses GitHub Actions for continuous integration. The pipeline automatically runs on every push and pull request to ensure that:
- Dependencies are installed correctly.
- The code follows the style guidelines (linting).
- All tests pass.

This setup is designed to prevent breaking changes, especially when dependency updates are automated.

## 🤝 Contributing
If you have ideas, improvements, or new features:

1. Fork the project
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 💡 Acknowledgments

This project was developed with the help of AI tools for code suggestions, debugging, and optimizations.

## 📄 License

MIT