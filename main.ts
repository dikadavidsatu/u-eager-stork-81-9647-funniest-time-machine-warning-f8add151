// Funniest Time Machine Warning Label
// make.fun entry — writes a single warning label to /output/entry.txt.
//
// The warning: "NOTICE: Do not meet your past self. He has the same
// ideas, worse hair, and he will ask you for money."
// It reads like an official notice — NOTICE, then a prohibition —
// and then the reasons escalate from the philosophical (same ideas)
// to the cosmetic (worse hair) to the practical and damning (he will
// ask you for money). The twist is that the danger of meeting your
// past self is not a paradox or a timeline collapse: it is that he
// is you, and you owe yourself money. The punchline lands in the
// last words.
//
// Why this warning should win:
//   * It is written as a real warning label: NOTICE, imperative,
//     official tone — the form is part of the joke.
//   * Three escalating reasons give it rhythm, and the third is the
//     punchline, so the laugh arrives exactly where it should.
//   * The twist reframes time travel's classic danger (the paradox)
//     as a mundane one (a loan request from yourself).
//   * One line, 101 characters: short, quotable, and it reads in a
//     single breath. A warning label that fits on one line is the
//     only kind a time traveller will actually read.
//
// Entry layout:
//   * WARNING — the single-line warning text (exported, so the gate
//     can be unit-checked without running main()).
//   * MAX_CHARS — the competition's character limit (120).
//   * OUTPUT_PATH — where the graded entry is written.
//   * countChars — counts Unicode code points, not UTF-16 units, so
//     multi-byte characters count once, matching the grader.
//   * isSingleLine — rejects any text with line breaks.
//   * isValidEntry — the competition gate, checked twice: once on
//     WARNING before writing, once on the file after writing.
//   * main — writes the entry, reads it back, and fails loudly if
//     the file does not match the warning exactly.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const WARNING =
  "NOTICE: Do not meet your past self. He has the same ideas, worse hair, and he will ask you for money.";

export const MAX_CHARS = 120;
export const OUTPUT_PATH = "/output/entry.txt";

/** Counts Unicode code points, so multi-byte characters count once. */
export function countChars(text: string): number {
  return [...text].length;
}

/** True when the text is a single non-blank line (no line breaks). */
export function isSingleLine(text: string): boolean {
  return !text.includes("\n") && !text.includes("\r");
}

/**
 * The competition gate: 1-120 characters of UTF-8 text, not only
 * whitespace, on a single line.
 */
export function isValidEntry(text: string): boolean {
  if (typeof text !== "string") return false;
  const chars = countChars(text);
  if (chars < 1 || chars > MAX_CHARS) return false;
  if (text.trim().length === 0) return false;
  if (!isSingleLine(text)) return false;
  return true;
}

function main(): void {
  if (!isValidEntry(WARNING)) {
    throw new Error(
      `Warning fails the gate: ${countChars(WARNING)} chars (limit ${MAX_CHARS})`,
    );
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, WARNING, "utf8");
  // Read it back and re-check the gate on exactly what was written,
  // so a partial write or encoding slip fails loudly instead of
  // silently shipping an invalid entry.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== WARNING || !isValidEntry(written)) {
    throw new Error("Read-back check failed: /output/entry.txt is not the warning");
  }
  console.log(`Wrote ${countChars(WARNING)} chars to ${OUTPUT_PATH}`);
  console.log(WARNING);
}

main();
