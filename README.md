# prescription-decoder

A small JavaScript library + CLI that decodes prescription abbreviations
(OD, BD, TDS, QID, HS, SOS, AC, PC, PRN…) into plain language with timing
guidance — the same codes explained in Prescripsy's "Decode your prescription
codes" education series.

> ⚠️ **Educational/demo only — not medical advice.** Always confirm a
> prescription with a pharmacist or doctor.

## Install / run

```bash
npm test          # run the test suite
npm run demo      # demo: decode a sample prescription line + list all codes
node src/cli.js BD
node src/cli.js "Tab Paracetamol 500mg BD PC x 5 days"
node src/cli.js --list
```

## Library usage

```js
import { decode, decodeText } from "./src/decoder.js";

decode("BD");   // { code: "BD", meaning: "Twice a day", timing: "…", category: "frequency" }
decodeText("Tab Amoxicillin 250mg TDS AC");
// → TAB, TDS, AC entries with plain-language explanations
```

## Dataset

47 abbreviations across frequency, food, route, form and instruction categories
(see `src/decoder.js`). Codes are matched case-insensitively and tolerate
dots (`b.d.` → `BD`).

## Author

M.Muhamad Ashik — Founder, Prescripsy · Contact: prescripsy@prescripsy.space

## License

MIT — see `LICENSE`.
