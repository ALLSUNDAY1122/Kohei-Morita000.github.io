import fs from "node:fs";
import path from "node:path";

export const requiredFields = [
  "id",
  "title",
  "slug",
  "excerpt",
  "publishedAt",
  "updatedAt",
  "author",
  "mainCategory",
  "subCategories",
  "tags",
  "setting",
  "fearLevel",
  "lengthType",
  "estimatedReadingMinutes",
  "endingType",
  "featured",
  "editorialScore",
  "contentWarning",
  "sourceType",
  "aiAssisted",
  "reviewStatus",
  "seoTitle",
  "seoDescription",
];

const sourceTypes = new Set(["original", "user-submission", "public-domain", "legend-explanation", "licensed"]);
const reviewStatuses = new Set(["draft", "ai-generated", "checked", "edited", "approved", "published", "rejected"]);

export function parseScalar(rawValue) {
  const raw = rawValue.trim();
  if (raw === "") return null;
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  if (raw.startsWith("[") && raw.endsWith("]")) return JSON.parse(raw);
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }
  return raw;
}

export function parseStoryFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { filePath, data: {}, raw: {}, body: text, errors: ["frontmatter is missing"] };
  }
  const raw = {};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const index = line.indexOf(":");
    if (index === -1) continue;
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    raw[key] = value;
    try {
      data[key] = parseScalar(value);
    } catch (error) {
      data[key] = value;
    }
  }
  return { filePath, data, raw, body: match[2].trim(), errors: [] };
}

export function readStories(root = path.join(process.cwd(), "src", "content", "stories")) {
  return fs
    .readdirSync(root)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .sort()
    .map((file) => parseStoryFile(path.join(root, file)));
}

export function textShingles(text, size = 5) {
  const normalized = text.replace(/\s+/g, "");
  const shingles = new Set();
  for (let i = 0; i <= normalized.length - size; i += 1) {
    shingles.add(normalized.slice(i, i + size));
  }
  return shingles;
}

export function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let intersection = 0;
  for (const value of a) {
    if (b.has(value)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
}

export function validateStories(stories) {
  const issues = [];
  const titleMap = new Map();
  const slugMap = new Map();
  const idMap = new Map();
  const knownStoryPaths = new Set(stories.map((story) => `/stories/${story.data.slug}/`));
  const knownStaticPaths = new Set([
    "/",
    "/stories/",
    "/categories/",
    "/tags/",
    "/series/",
    "/ranking/",
    "/search/",
    "/random/",
    "/favorites/",
    "/history/",
    "/about/",
    "/submission-guidelines/",
    "/privacy/",
    "/terms/",
    "/copyright/",
    "/contact/",
  ]);

  function add(story, level, message) {
    issues.push({ level, file: path.relative(process.cwd(), story.filePath), message });
  }

  for (const story of stories) {
    for (const error of story.errors) add(story, "error", error);
    for (const field of requiredFields) {
      if (!(field in story.data) || story.data[field] === null || story.data[field] === "") {
        add(story, "error", `required field is missing: ${field}`);
      }
    }

    if (story.data.title) {
      if (titleMap.has(story.data.title)) add(story, "error", `duplicate title with ${titleMap.get(story.data.title)}`);
      titleMap.set(story.data.title, path.basename(story.filePath));
    }
    if (story.data.slug) {
      if (slugMap.has(story.data.slug)) add(story, "error", `duplicate slug with ${slugMap.get(story.data.slug)}`);
      slugMap.set(story.data.slug, path.basename(story.filePath));
      if (!/^[a-z0-9-]+$/.test(story.data.slug)) add(story, "error", "slug must use lowercase ASCII letters, numbers, and hyphens");
    }
    if (story.data.id) {
      if (idMap.has(story.data.id)) add(story, "error", `duplicate id with ${idMap.get(story.data.id)}`);
      idMap.set(story.data.id, path.basename(story.filePath));
    }

    const bodyLength = story.body.replace(/\s+/g, "").length;
    if (bodyLength < 120) add(story, "error", `body is too short: ${bodyLength} chars`);
    if (bodyLength > 15000) add(story, "warning", `body is unusually long: ${bodyLength} chars`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(story.raw.publishedAt || "")) add(story, "error", "publishedAt must be YYYY-MM-DD");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(story.raw.updatedAt || "")) add(story, "error", "updatedAt must be YYYY-MM-DD");
    if (!sourceTypes.has(story.data.sourceType)) add(story, "error", `invalid sourceType: ${story.data.sourceType}`);
    if (!reviewStatuses.has(story.data.reviewStatus)) add(story, "error", `invalid reviewStatus: ${story.data.reviewStatus}`);
    if (story.data.reviewStatus === "published" && story.data.sourceType !== "original" && !story.data.author) {
      add(story, "error", "published non-original story must include author/source information");
    }
    if (/TODO|Lorem ipsum|ダミー|仮テキスト|ここに本文/.test(story.body + JSON.stringify(story.data))) {
      add(story, "error", "placeholder text remains");
    }
    if (/image:\s*['"]?\s*['"]?$/m.test(JSON.stringify(story.raw))) {
      add(story, "error", "empty image path is present");
    }

    const repeated = story.body.match(/(.{8,30})\1{3,}/gs);
    if (repeated) add(story, "warning", "possible excessive repeated expression");

    const links = [...story.body.matchAll(/\]\((\/[^)]+)\)/g)].map((match) => match[1]);
    for (const link of links) {
      if (!knownStoryPaths.has(link) && !knownStaticPaths.has(link)) {
        add(story, "error", `invalid internal link: ${link}`);
      }
    }
  }

  const shingles = stories.map((story) => ({ story, shingles: textShingles(story.body) }));
  for (let i = 0; i < shingles.length; i += 1) {
    for (let j = i + 1; j < shingles.length; j += 1) {
      const score = jaccard(shingles[i].shingles, shingles[j].shingles);
      if (score > 0.42) {
        add(shingles[j].story, "warning", `high similarity to ${path.basename(shingles[i].story.filePath)}: ${score.toFixed(2)}`);
      }
    }
  }

  return issues;
}
