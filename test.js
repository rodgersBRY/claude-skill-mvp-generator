const assert = require("assert");

// Test 1: basic math
assert.strictEqual(2 + 2, 4, "2 + 2 should equal 4");

// Test 2: string check
assert.strictEqual("hello".toUpperCase(), "HELLO", "toUpperCase should work");

// Test 3: array length
const items = ["task1", "task2", "task3"];
assert.strictEqual(items.length, 3, "array should have 3 items");

console.log("All tests passed.");
