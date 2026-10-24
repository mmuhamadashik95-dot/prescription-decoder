import test from "node:test";
import assert from "node:assert/strict";
import { ABBREVIATIONS, decode, decodeText, normalise } from "../src/decoder.js";

test("dataset has 30+ abbreviations", () => {
  assert.ok(ABBREVIATIONS.length >= 30, `only ${ABBREVIATIONS.length}`);
});

test("decode is case- and dot-insensitive", () => {
  assert.equal(decode("bd").meaning, "Twice a day");
  assert.equal(decode("b.d.").meaning, "Twice a day");
  assert.equal(decode("Tds").meaning, "Three times a day");
});

test("decode returns null for unknown codes", () => {
  assert.equal(decode("XYZ"), null);
});

test("decodeText extracts codes from a prescription line", () => {
  const found = decodeText("Tab Paracetamol 500mg BD PC x 5 days");
  const codes = found.map((e) => e.code);
  assert.deepEqual(codes, ["TAB", "BD", "PC"]);
});

test("decodeText dedupes repeated codes", () => {
  const found = decodeText("BD BD OD");
  assert.deepEqual(found.map((e) => e.code), ["BD", "OD"]);
});

test("normalise strips punctuation", () => {
  assert.equal(normalise("q.h.s."), "QHS");
});

test("every entry has meaning and timing", () => {
  for (const e of ABBREVIATIONS) {
    assert.ok(e.meaning && e.timing, `incomplete entry: ${e.code}`);
  }
});
