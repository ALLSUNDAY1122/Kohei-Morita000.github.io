import fs from "node:fs";
import path from "node:path";

const dist = path.join(process.cwd(), "dist");

if (!fs.existsSync(dist)) {
  console.log("Link check skipped: dist/ does not exist yet.");
  process.exit(0);
}

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(dist);

function existsForHref(href) {
  if (!href.startsWith("/") || href.startsWith("//")) return true;
  const clean = href.split("#")[0].split("?")[0];
  if (clean === "/") return fs.existsSync(path.join(dist, "index.html"));
  if (path.extname(clean)) return fs.existsSync(path.join(dist, clean));
  return fs.existsSync(path.join(dist, clean, "index.html"));
}

const issues = [];
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const matches = html.matchAll(/\s(?:href|src)="([^"]+)"/g);
  for (const match of matches) {
    const href = match[1];
    if (href.startsWith("mailto:") || href.startsWith("http") || href.startsWith("data:")) continue;
    if (!existsForHref(href)) {
      issues.push(`${path.relative(dist, file)} -> ${href}`);
    }
  }
}

console.log(`Link check: ${htmlFiles.length} HTML files, ${issues.length} issues`);
for (const issue of issues) console.log(`ERROR   ${issue}`);
if (issues.length > 0) process.exitCode = 1;
