const assert = require("assert");
const fs = require("fs");
const { execSync } = require("child_process");

const results = [];

function test(name, fn) {
  try {
    fn();
    results.push({ name, passed: true });
  } catch (err) {
    results.push({ name, passed: false, error: err.message });
  }
}

// ── Tests ────────────────────────────────────────
test("2 + 2 equals 4", () => assert.strictEqual(2 + 2, 4));
test("toUpperCase works", () => assert.strictEqual("hello".toUpperCase(), "HELLO"));
test("array has 3 items", () => assert.strictEqual(["task1", "task2", "task3"].length, 3));
// ─────────────────────────────────────────────────

const passed = results.filter((r) => r.passed).length;
const failed = results.filter((r) => !r.passed).length;

// Print to terminal
results.forEach((r) => console.log(`${r.passed ? "✅" : "❌"} ${r.name}${r.error ? " — " + r.error : ""}`));
console.log(`\n${passed} passed · ${failed} failed`);

// Generate HTML report
const rows = results.map((r) => `
  <tr class="${r.passed ? "pass" : "fail"}">
    <td>${r.passed ? "✅" : "❌"}</td>
    <td>${r.name}</td>
    <td>${r.error || ""}</td>
  </tr>`).join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Results</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; background: #f9f9f9; }
    h1 { font-size: 1.4rem; margin-bottom: 4px; }
    .summary { font-size: 0.95rem; color: #555; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600; }
    .badge.ok { background: #d1fae5; color: #065f46; }
    .badge.err { background: #fee2e2; color: #991b1b; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    th { background: #f1f5f9; text-align: left; padding: 10px 14px; font-size: 0.85rem; color: #475569; }
    td { padding: 10px 14px; border-top: 1px solid #f1f5f9; font-size: 0.9rem; }
    tr.fail td { background: #fff5f5; color: #991b1b; }
    tr.pass td { color: #1e293b; }
  </style>
</head>
<body>
  <h1>Test Results</h1>
  <p class="summary">
    ${new Date().toLocaleString()} &nbsp;·&nbsp;
    <span class="badge ok">${passed} passed</span>
    ${failed ? `&nbsp;<span class="badge err">${failed} failed</span>` : ""}
  </p>
  <table>
    <thead><tr><th></th><th>Test</th><th>Error</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;

fs.writeFileSync("tests/reports/test-results.html", html);
console.log("\nReport → tests/reports/test-results.html");

// Open in browser
try { execSync("open tests/reports/test-results.html"); } catch {}

if (failed > 0) process.exit(1);
