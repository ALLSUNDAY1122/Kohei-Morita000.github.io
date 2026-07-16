import { readStories, validateStories } from "./content-utils.mjs";

const stories = readStories();
const issues = validateStories(stories);
const errors = issues.filter((issue) => issue.level === "error");
const warnings = issues.filter((issue) => issue.level === "warning");

console.log(`Content check: ${stories.length} stories, ${errors.length} errors, ${warnings.length} warnings`);

for (const issue of issues) {
  const label = issue.level.toUpperCase().padEnd(7);
  console.log(`${label} ${issue.file}: ${issue.message}`);
}

if (errors.length > 0) {
  process.exitCode = 1;
}
