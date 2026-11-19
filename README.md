# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Reyzz95/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Reyzz95/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 GTA VI PlayStation 5 trophies, with a platinum roadmap, missable flags and sourced guides.

## Run it

```sh
node serve.ts
# Then open http://localhost:8080
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=4jw1320n&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

## Field guide

No installation or build step. All assets and trophy data load from app/. Source links open only when clicked. Progress is stored in localStorage; Export and Import move a JSON backup between browsers. Spoiler shield starts on and protects unearned story trophies.

Views: `#checklist`, `#trophy-28` (missable guide), `#roadmap`. Trophy names, descriptions and grades preserve the supplied official list. Guides are independently written from the supplied source research; unconfirmed methods are labeled. This is an independent fan guide, with original CSS artwork and no official art.

Build the submission: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`. Run browser checks with `PLAYWRIGHT_MODULE=/path/to/playwright-core/index.mjs node scripts/capture-and-check.mjs` with a working Chromium installation. The script starts and stops the local server, tests the tracker and captures four JPEGs. `CHROME_BINARY` and `CHROME_ARGS` (a JSON array) can supply local browser configuration.

## Verification status

Verified on November 19, 2026. The four screenshots in `screenshots/` are real renders of this app captured with headless Chromium. Each is a 1280×800 JPEG under 256 KiB: the checklist, missable trophy guide, platinum roadmap and story checklist with Spoiler shield on.

Browser checks pass: 55 trophy rows, spoiler protection, earned state surviving reload, export/import, invalid import rejection, filters, guide sources, the four-stage roadmap and offline interactions. The capture script searches guide text as well as trophy names, clicks the custom Spoiler shield label and clears transient notifications before capture.

`node scripts/validate-data.mjs` passes: 55 unique trophies, grade totals 1/2/6/46, 28 hidden trophies, one missable trophy, complete sourced guides and local assets. `MAKEFUN_OUTPUT_DIR=out node main.ts` builds successfully; `out/dossier.json` exists and `out/screenshots/` contains the four new captures.
