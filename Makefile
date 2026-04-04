.PHONY: setup lint lint-md lint-fix format format-check lint-links lint-frontmatter clean

## Setup development environment
setup:
	npm install
	@command -v pre-commit >/dev/null 2>&1 && pre-commit install || echo "Optional: install pre-commit (pip install pre-commit) for git hooks"

## Run all linters
lint: lint-md lint-frontmatter

## Markdown linting
lint-md:
	npx markdownlint '**/*.md' --config .markdownlint.json --ignore node_modules

## Fix auto-fixable markdown lint issues
lint-fix:
	npx markdownlint '**/*.md' --config .markdownlint.json --ignore node_modules --fix

## Check formatting
format-check:
	npx prettier --check '**/*.md' '**/*.json' '**/*.yml' --ignore-path .prettierignore

## Auto-format files
format:
	npx prettier --write '**/*.md' '**/*.json' '**/*.yml' --ignore-path .prettierignore

## Check links (requires lychee: brew install lychee or cargo install lychee)
lint-links:
	lychee --no-progress '**/*.md'

## Validate YAML frontmatter in EVES specs
lint-frontmatter:
	node scripts/validate-frontmatter.mjs

## Remove generated files
clean:
	rm -rf node_modules .lycheecache
