// Prescription abbreviation decoder — plain-language expansion + timing guidance.
// Educational/demo only — not medical advice. Always confirm with a pharmacist.

export const ABBREVIATIONS = [
  { code: "OD", meaning: "Once a day", timing: "Take once every 24 hours, at the same time each day.", category: "frequency" },
  { code: "QD", meaning: "Once a day", timing: "Take once every 24 hours, at the same time each day.", category: "frequency" },
  { code: "BD", meaning: "Twice a day", timing: "Take two doses a day, roughly 12 hours apart (morning and evening).", category: "frequency" },
  { code: "BID", meaning: "Twice a day", timing: "Take two doses a day, roughly 12 hours apart (morning and evening).", category: "frequency" },
  { code: "TDS", meaning: "Three times a day", timing: "Take three doses a day, roughly 8 hours apart.", category: "frequency" },
  { code: "TID", meaning: "Three times a day", timing: "Take three doses a day, roughly 8 hours apart.", category: "frequency" },
  { code: "QID", meaning: "Four times a day", timing: "Take four doses a day, roughly 6 hours apart.", category: "frequency" },
  { code: "QHS", meaning: "Every night at bedtime", timing: "Take once, at bedtime.", category: "frequency" },
  { code: "HS", meaning: "At bedtime", timing: "Take once, at bedtime.", category: "frequency" },
  { code: "MANE", meaning: "In the morning", timing: "Take once, in the morning.", category: "frequency" },
  { code: "NOCTE", meaning: "At night", timing: "Take once, at night.", category: "frequency" },
  { code: "SOS", meaning: "Only when needed", timing: "Take only when the symptom occurs, never on a fixed schedule.", category: "frequency" },
  { code: "PRN", meaning: "As needed", timing: "Take only when needed, within the maximum daily limit on the label.", category: "frequency" },
  { code: "STAT", meaning: "Immediately", timing: "Take/give immediately, as a single urgent dose.", category: "frequency" },
  { code: "QH", meaning: "Every hour", timing: "Take once every hour.", category: "frequency" },
  { code: "Q2H", meaning: "Every 2 hours", timing: "Take once every 2 hours.", category: "frequency" },
  { code: "Q4H", meaning: "Every 4 hours", timing: "Take once every 4 hours.", category: "frequency" },
  { code: "Q6H", meaning: "Every 6 hours", timing: "Take once every 6 hours.", category: "frequency" },
  { code: "Q8H", meaning: "Every 8 hours", timing: "Take once every 8 hours.", category: "frequency" },
  { code: "Q12H", meaning: "Every 12 hours", timing: "Take once every 12 hours.", category: "frequency" },
  { code: "QOD", meaning: "Every other day", timing: "Take once every second day.", category: "frequency" },
  { code: "QW", meaning: "Once a week", timing: "Take once a week, on the same day each week.", category: "frequency" },
  { code: "QM", meaning: "Once a month", timing: "Take once a month, on the same date each month.", category: "frequency" },
  { code: "AC", meaning: "Before food", timing: "Take before eating (usually 30 minutes before a meal).", category: "food" },
  { code: "PC", meaning: "After food", timing: "Take after eating.", category: "food" },
  { code: "C", meaning: "With food", timing: "Take together with a meal.", category: "food" },
  { code: "PO", meaning: "By mouth", timing: "Swallow the medicine.", category: "route" },
  { code: "IV", meaning: "Intravenously (into a vein)", timing: "Given by a healthcare professional into a vein.", category: "route" },
  { code: "IM", meaning: "Intramuscularly (into a muscle)", timing: "Given by injection into a muscle.", category: "route" },
  { code: "SC", meaning: "Under the skin", timing: "Given by injection just under the skin.", category: "route" },
  { code: "SL", meaning: "Under the tongue", timing: "Place under the tongue and let it dissolve; do not swallow whole.", category: "route" },
  { code: "PR", meaning: "Per rectum", timing: "Inserted rectally.", category: "route" },
  { code: "PV", meaning: "Per vaginam", timing: "Inserted vaginally.", category: "route" },
  { code: "TD", meaning: "Through the skin (transdermal)", timing: "Applied to the skin (patch or gel).", category: "route" },
  { code: "TAB", meaning: "Tablet", timing: "Form of the medicine: a tablet.", category: "form" },
  { code: "CAP", meaning: "Capsule", timing: "Form of the medicine: a capsule.", category: "form" },
  { code: "SYR", meaning: "Syrup / liquid", timing: "Form of the medicine: a liquid to be measured and swallowed.", category: "form" },
  { code: "INJ", meaning: "Injection", timing: "Form of the medicine: an injection.", category: "form" },
  { code: "GTT", meaning: "Drops", timing: "Form of the medicine: drops (eye, ear or nose as directed).", category: "form" },
  { code: "UNG", meaning: "Ointment", timing: "Form of the medicine: an ointment applied to skin.", category: "form" },
  { code: "SUPP", meaning: "Suppository", timing: "Form of the medicine: a suppository.", category: "form" },
  { code: "NEB", meaning: "Nebuliser solution", timing: "Form of the medicine: inhaled through a nebuliser.", category: "form" },
  { code: "SR", meaning: "Slow release", timing: "Releases the medicine slowly; swallow whole, do not crush or chew.", category: "form" },
  { code: "CR", meaning: "Controlled release", timing: "Releases the medicine slowly; swallow whole, do not crush or chew.", category: "form" },
  { code: "ER", meaning: "Extended release", timing: "Releases the medicine slowly; swallow whole, do not crush or chew.", category: "form" },
  { code: "XL", meaning: "Extended release", timing: "Releases the medicine slowly; swallow whole, do not crush or chew.", category: "form" },
  { code: "DIL", meaning: "Dilute", timing: "Dilute as directed before use.", category: "instruction" },
  { code: "NPO", meaning: "Nothing by mouth", timing: "Do not eat or drink, as directed (e.g. before a procedure).", category: "instruction" },
];

const byCode = new Map(ABBREVIATIONS.map((e) => [e.code, e]));

/** Normalise a code: upper-case, strip dots/spaces. e.g. "b.d." -> "BD". */
export function normalise(code) {
  return String(code).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

/** Decode a single abbreviation. Returns the entry or null if unknown. */
export function decode(code) {
  return byCode.get(normalise(code)) ?? null;
}

/**
 * Decode every known abbreviation found in free text (e.g. a prescription line).
 * Returns an array of entries in order of appearance, without duplicates.
 */
export function decodeText(text) {
  const tokens = String(text).toUpperCase().match(/[A-Z0-9]+(?:\.[A-Z0-9]+)*/g) ?? [];
  const seen = new Set();
  const out = [];
  for (const token of tokens) {
    const entry = decode(token);
    if (entry && !seen.has(entry.code)) {
      seen.add(entry.code);
      out.push(entry);
    }
  }
  return out;
}

/** One-line plain-language summary of an entry. */
export function explain(entry) {
  return `${entry.code} = ${entry.meaning}. ${entry.timing}`;
}
