export function checkRuleInlined({ ruleName, mdContent, registerJsContent }) {
  // To compare, we need to understand register.js template literal escaping.
  // In register.js, the RULES object uses template literals. Any backtick in
  // the rule content must be backslash-escaped in the JS source.
  // Additionally, `${` must be escaped to prevent template interpolation.

  // Normalize the md content:
  // 1. Normalize line endings
  // 2. Strip trailing newline (template literal last line has no trailing \n)
  // 3. Escape backslashes, backticks, and template interpolation sequences
  //    the same way register.js does
  const normalizedMd = mdContent
    .replace(/\r\n/g, "\n")
    .replace(/\n$/, "")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  if (registerJsContent.includes(normalizedMd)) {
    return { name: ruleName, status: "pass", detail: `Rule "${ruleName}" correctly inlined` };
  }

  return { name: ruleName, status: "fail", detail: `Rule "${ruleName}" content not found in register.js` };
}
