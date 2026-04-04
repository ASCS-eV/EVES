import { readFileSync, readdirSync, statSync } from "fs";
import { join, basename, dirname } from "path";
import matter from "gray-matter";

const REQUIRED_FIELDS = [
  "eves-identifier",
  "title",
  "author",
  "discussions-to",
  "status",
  "type",
  "created",
  "requires",
  "replaces",
];

const VALID_STATUSES = [
  "Draft",
  "Review",
  "Candidate",
  "Final",
  "Deferred",
  "Rejected",
  "Superseded",
];

const VALID_TYPES = ["Process", "Standards", "Informational"];

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function findEvesFiles(baseDir) {
  const files = [];
  const entries = readdirSync(baseDir);
  for (const entry of entries) {
    const fullPath = join(baseDir, entry);
    if (statSync(fullPath).isDirectory() && entry.startsWith("EVES-")) {
      const subEntries = readdirSync(fullPath);
      for (const sub of subEntries) {
        if (sub.startsWith("eves-") && sub.endsWith(".md")) {
          files.push(join(fullPath, sub));
        }
      }
    }
  }
  return files;
}

function validate(filePath) {
  const errors = [];
  const content = readFileSync(filePath, "utf-8");
  const { data } = matter(content);

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  // Validate status
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(
      `Invalid status "${data.status}". Must be one of: ${VALID_STATUSES.join(", ")}`,
    );
  }

  // Validate type
  if (data.type && !VALID_TYPES.includes(data.type)) {
    errors.push(
      `Invalid type "${data.type}". Must be one of: ${VALID_TYPES.join(", ")}`,
    );
  }

  // Validate date format (gray-matter/js-yaml auto-parses YYYY-MM-DD into Date objects)
  if (data.created) {
    if (data.created instanceof Date) {
      // YAML parsed it as a valid date — this is the expected case for YYYY-MM-DD
      if (isNaN(data.created.getTime())) {
        errors.push(`Invalid date value for "created".`);
      }
    } else if (!DATE_REGEX.test(String(data.created))) {
      errors.push(
        `Invalid date format "${data.created}". Must be YYYY-MM-DD`,
      );
    }
  }

  // Validate identifier matches directory
  if (data["eves-identifier"]) {
    const id = String(data["eves-identifier"]).padStart(3, "0");
    const dir = basename(dirname(filePath));
    const expectedDir = `EVES-${id}`;
    if (dir !== expectedDir) {
      errors.push(
        `Identifier "${id}" does not match directory "${dir}" (expected "${expectedDir}")`,
      );
    }
  }

  return errors;
}

// Main
const evesDir = join(process.cwd(), "EVES");
const files = findEvesFiles(evesDir);
let hasErrors = false;

for (const file of files) {
  const relative = file.replace(process.cwd() + "/", "");
  const errors = validate(file);
  if (errors.length > 0) {
    hasErrors = true;
    console.error(`\n${relative}:`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
  } else {
    console.log(`${relative}: OK`);
  }
}

if (hasErrors) {
  console.error("\nFrontmatter validation failed.");
  process.exit(1);
} else {
  console.log("\nAll frontmatter is valid.");
}
