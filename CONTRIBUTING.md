# Contributing to EVES

Thank you for your interest in contributing to the ENVITED Ecosystem Specifications.

## Prerequisites

- [Node.js](https://nodejs.org/) 22 or later
- (Optional) [Python 3](https://www.python.org/) for pre-commit hooks
- (Optional) [lychee](https://lychee.cli.rs/) for link checking

## Getting Started

```bash
# Clone the repository
git clone https://github.com/ASCS-eV/EVES.git
cd EVES

# Install development tooling
make setup
```

This installs the linting and formatting tools. If you have `pre-commit` installed, it will also set up git hooks that run automatically before each commit.

## Writing a New EVES

1. Copy `EVES/resources/eves-template.md` into a new directory `EVES/EVES-XXX/eves-XXX.md`
2. Fill in all YAML frontmatter fields (see the template for required fields)
3. Follow the [Style Guide](EVES/resources/style-guide.md)
4. Use `YYYY-MM-DD` format for dates
5. Submit a pull request

## Before Submitting a PR

Run the quality checks locally:

```bash
# Run all linters
make lint

# Check formatting
make format-check

# Auto-fix formatting issues
make format

# Auto-fix markdown lint issues
make lint-fix
```

## CI Checks

Every pull request is automatically checked by:

| Check                      | What it does                                 |
| -------------------------- | -------------------------------------------- |
| **Markdown Lint**          | Validates markdown structure and syntax      |
| **Prose Lint (Vale)**      | Checks writing style, spelling, and grammar  |
| **Format Check**           | Ensures consistent formatting via Prettier   |
| **Frontmatter Validation** | Validates YAML metadata in EVES specs        |
| **Link Check**             | Verifies URLs in documentation are reachable |

## Editor Setup

If you use VS Code, open the repository and accept the recommended extensions prompt. This gives you real-time feedback from markdownlint, Prettier, Vale, and EditorConfig as you write.

## Process

All changes must be submitted as pull requests. See [EVES-001](EVES/EVES-001/eves-001.md) for the full specification process, including roles, review stages, and approval requirements.
