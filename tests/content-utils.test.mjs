import { describe, expect, it } from "vitest";
import { jaccard, parseScalar, textShingles, validateStories } from "../scripts/content-utils.mjs";

describe("content utilities", () => {
  it("parses scalar frontmatter values", () => {
    expect(parseScalar('"短編"')).toBe("短編");
    expect(parseScalar("true")).toBe(true);
    expect(parseScalar("5")).toBe(5);
    expect(parseScalar('["家","学校"]')).toEqual(["家", "学校"]);
  });

  it("computes similarity using shingles", () => {
    const a = textShingles("同じ文章がここにあります");
    const b = textShingles("同じ文章がここにあります");
    const c = textShingles("まったく別の内容です");
    expect(jaccard(a, b)).toBe(1);
    expect(jaccard(a, c)).toBeLessThan(0.5);
  });

  it("reports duplicate slugs", () => {
    const base = {
      filePath: "a.md",
      raw: { publishedAt: "2026-07-01", updatedAt: "2026-07-01" },
      body: "これは十分な長さの本文です。怖い出来事が起こり、最後に違和感が残ります。さらに検査用に文字数を増やします。",
      errors: [],
      data: {
        id: "a",
        title: "A",
        slug: "same",
        excerpt: "excerpt",
        publishedAt: "2026-07-01",
        updatedAt: "2026-07-01",
        author: "editor",
        mainCategory: "心霊・幽霊",
        subCategories: [],
        tags: [],
        setting: [],
        fearLevel: 3,
        lengthType: "短編",
        estimatedReadingMinutes: 3,
        endingType: [],
        featured: false,
        editorialScore: 1,
        contentWarning: [],
        sourceType: "original",
        aiAssisted: true,
        reviewStatus: "published",
        seoTitle: "A",
        seoDescription: "desc",
      },
    };
    const issues = validateStories([
      base,
      { ...base, filePath: "b.md", data: { ...base.data, id: "b", title: "B" } },
    ]);
    expect(issues.some((issue) => issue.message.includes("duplicate slug"))).toBe(true);
  });
});
