import test, { describe } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

describe("UI Icon Audit - No raw emoji icons in components", () => {
  function getAllComponentFiles(dir: string): string[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    let files: string[] = [];
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(getAllComponentFiles(fullPath));
      } else if (/\.(tsx|jsx)$/.test(entry.name)) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const srcDir = path.resolve(process.cwd(), "src");
  const allComponentFiles = getAllComponentFiles(srcDir);

  const forbiddenEmojiPattern = /[⚡📅💬✓🔥💰⏳👉✨🎯🚀💡🎉🏆📍]/u;

  test("verifies no emoji UI icons across all components in the entire application", () => {
    assert.ok(allComponentFiles.length >= 10, "Should have discovered all component files");

    for (const fullPath of allComponentFiles) {
      const relPath = path.relative(process.cwd(), fullPath);
      const content = fs.readFileSync(fullPath, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        const isComment = trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*");
        if (!isComment && forbiddenEmojiPattern.test(line)) {
          assert.fail(`Found forbidden emoji in ${relPath}:${index + 1}: ${trimmed}`);
        }
      });
    }
  });

  test("verifies Hero.tsx imports and renders Lucide SVG icons", () => {
    const heroPath = path.resolve(process.cwd(), "src/components/home/Hero.tsx");
    const content = fs.readFileSync(heroPath, "utf8");

    assert.ok(content.includes('from "lucide-react"'), "Hero.tsx must import from lucide-react");
    assert.ok(content.includes("<Zap"), "Hero.tsx must render Zap icon");
    assert.ok(content.includes("<Calendar"), "Hero.tsx must render Calendar icon");
    assert.ok(content.includes("<MessageCircle"), "Hero.tsx must render MessageCircle icon");
  });

  test("verifies AboutPage renders Lucide Check icon instead of checkmark character", () => {
    const aboutPath = path.resolve(process.cwd(), "src/app/about/page.tsx");
    const content = fs.readFileSync(aboutPath, "utf8");

    assert.ok(content.includes('from "lucide-react"'), "About page must import from lucide-react");
    assert.ok(content.includes("<Check"), "About page must render Lucide Check icon");
    assert.ok(!content.includes("✓"), "About page must not contain raw checkmark character");
  });
});
