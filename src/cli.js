#!/usr/bin/env node
// CLI for prescription-decoder. Usage:
//   node src/cli.js BD
//   node src/cli.js "Tab Paracetamol 500mg BD PC x 5 days"
//   node src/cli.js --list
import { ABBREVIATIONS, decode, decodeText, explain } from "./decoder.js";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: node src/cli.js <code | prescription line> | --list");
  process.exit(1);
}
if (args[0] === "--list") {
  for (const e of ABBREVIATIONS) console.log(explain(e));
  console.log(`\n${ABBREVIATIONS.length} abbreviations. Educational/demo only — not medical advice.`);
  process.exit(0);
}
const input = args.join(" ");
const single = decode(input);
if (single && args.length === 1) {
  console.log(explain(single));
} else {
  const found = decodeText(input);
  if (found.length === 0) {
    console.log(`No known abbreviation found in: "${input}"`);
  } else {
    for (const e of found) console.log(explain(e));
  }
}
console.log("\nEducational/demo only — not medical advice. Confirm with a pharmacist.");
