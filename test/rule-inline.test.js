import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { checkRuleInlined } from "../.opencode/plugins/rule-inline-check.js";

/**
 * Simulate register.js rule inlining: given the raw .md content,
 * produce what register.js would look like after embedding it in a template literal.
 * In register.js: \` in md becomes \\` in the template literal source.
 */
function inlineMdAsRegisterJsSource(ruleName, mdContent) {
  const escaped = mdContent.replace(/\\/g, "\\\\").replace(/`/g, "\\`");
  return `const RULES = {\n  "${ruleName}": \`${escaped}\`,\n};`;
}

test("checkRuleInlined returns pass when md content is correctly inlined", () => {
  const mdContent = "# Example Rule\n\nUsage:\n```bash\nnpm test\n```\n";
  const registerJsContent = inlineMdAsRegisterJsSource("example-rule", mdContent);

  const result = checkRuleInlined({
    ruleName: "example-rule",
    mdContent,
    registerJsContent,
  });

  assert.equal(result.status, "pass");
  assert.equal(result.name, "example-rule");
  assert.match(result.detail, /inlined/i);
});

test("every .opencode/rules/*.md has a matching key in register.js RULES", () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rulesDir = path.resolve(__dirname, "../.opencode/rules");
  const registerJsContent = fs.readFileSync(
    path.resolve(__dirname, "../.opencode/plugins/register.js"),
    "utf-8"
  );

  // Extract rule names from RULES object keys: `  "rule-name":`
  const inlinedNames = new Set(
    [...registerJsContent.matchAll(/\n {2}"([\w-]+)": `/g)].map((m) => m[1])
  );

  const mdFiles = fs.readdirSync(rulesDir).filter((f) => f.endsWith(".md"));

  for (const file of mdFiles) {
    const name = path.basename(file, ".md");
    assert.ok(
      inlinedNames.has(name),
      `Rule "${name}" exists as ${file} but is missing from register.js RULES`
    );
  }

  assert.ok(mdFiles.length > 0, "No rule .md files found");
});

test("all four rule markdown files have content correctly inlined in register.js RULES", () => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const rulesDir = path.resolve(__dirname, "../.opencode/rules");
  const registerJsContent = fs.readFileSync(
    path.resolve(__dirname, "../.opencode/plugins/register.js"),
    "utf-8"
  );

  const mdFiles = fs.readdirSync(rulesDir).filter((f) => f.endsWith(".md"));

  for (const file of mdFiles) {
    const name = path.basename(file, ".md");
    const mdContent = fs.readFileSync(path.join(rulesDir, file), "utf-8");

    const result = checkRuleInlined({
      ruleName: name,
      mdContent,
      registerJsContent,
    });

    assert.equal(
      result.status,
      "pass",
      `${name}: ${result.detail}`
    );
  }
});
