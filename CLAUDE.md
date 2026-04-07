# CLAUDE.md

## Project overview

EVES (ENVITED-X Verifiable Ecosystem Specifications) defines standards for the ENVITED-X Data Space.
Each specification lives in `EVES/EVES-NNN/eves-nnn.md` with associated examples, schemas, and assets.

## Setup

```sh
npm install
pre-commit install
```

## Quality checks

Before every commit, run:

```sh
make lint          # markdownlint + frontmatter validation
make format-check  # Prettier formatting
```

Pre-commit hooks enforce: trailing whitespace, end-of-file newlines, valid YAML/JSON, no merge conflicts, markdownlint, and Prettier formatting.

CI additionally runs Vale prose linting (`spelling_linter.yml`) and link checking (`link_checker.yml`).

### Vale prose lint rules

The project uses Vale with Google, proselint, and write-good styles (see `.vale.ini`). Key rules that cause CI failures:

- Use "for example" instead of "e.g." or "i.e." (`Google.Latin`)
- Do not put spaces around em-dashes (`Google.EmDash`); use colons or rewrite instead
- Use sentence-style capitalization in headings (`Google.Headings`)

To run Vale locally: install [Vale](https://vale.sh/docs/install), then `vale sync && vale EVES/`.

### Markdown lint rules

See `.markdownlint.json`. Maximum line length is 300 characters (tables and code blocks are exempt).
HTML elements `<a>`, `<br>`, `<img>`, `<sup>` are allowed.

## File conventions

- Specification documents use YAML frontmatter with fields: `eves-identifier`, `title`, `author`, `status`, `type`, `created`, `requires`, `replaces`
- JSON schemas go in `eves-nnn-schemas/` directories (excluded from Prettier in `.prettierignore`)
- Example files go in `example/` directories (excluded from Prettier in `.prettierignore`)
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) with scope: `feat(EVES-003): ...`, `fix(ci): ...`
- Branches follow `feat/eves-nnn-description` naming

## Ontology references

The ENVITED-X ontologies are maintained in [ontology-management-base](https://github.com/ASCS-eV/ontology-management-base).
Current versions: `envited-x/v3/`, `manifest/v5/`, `hdmap/v6/`.

The Gaia-X ontology follows the Loire (25.11) release. Key naming:

- `envited-x:ResourceDescription` (subclass of `gx:VirtualResource`) carries the GX compliance metadata
- `gx:name`, `gx:description` are used in the `envited-x:ResourceDescriptionShape` SHACL
- `gx:license`, `gx:copyrightOwnedBy`, `gx:resourcePolicy` remain GX-native properties
