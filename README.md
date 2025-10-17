# Profile Similarity CLI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A command-line interface (CLI) tool for finding similar profiles and potential mentors from a CSV dataset. This tool uses cosine similarity to compare profiles based on their skills and experience.

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

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.