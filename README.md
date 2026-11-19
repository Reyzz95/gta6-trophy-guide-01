# Leonida Field Guide

An offline guide and tracker for all 55 GTA VI PlayStation 5 trophies, with a platinum roadmap, missable flags and sourced guides.

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/gta6-trophy-guide-01)
[![Entry rank](https://make.fun/badge/gta6-trophy-guide-01/Reyzz95/gta6-trophy-guide-01/rank.svg)](https://make.fun/gta6-trophy-guide-01)
[![Entry reward](https://make.fun/badge/gta6-trophy-guide-01/Reyzz95/gta6-trophy-guide-01/reward.svg)](https://make.fun/gta6-trophy-guide-01)

Built by **Reyzz95** for the make.fun `gta6-trophy-guide-01` bounty.

## Run locally

```sh
node serve.ts
```

Open http://localhost:8080 in a desktop browser. Node 22 or newer serves the static app without a build step or package installation.

## Plan your platinum

Use the checklist to mark earned trophies, search guide text, and filter by grade, progress or activity type. Progress stays in this browser through localStorage; Export downloads a backup and Import restores one. Back up before clearing browser storage or moving to another device.

The spoiler shield starts enabled and protects unearned story names, descriptions and notes. Open the platinum roadmap for chapter saves, unlock milestones and the larger 100% targets. Start with **Positive Mental Attitude**: Lucia's balcony meditation disappears when Chapter 1 ends.

Every trophy has an original guide with source links. Unconfirmed methods are labeled as such. The app loads local files only; external references open solely when you choose a source link. No official artwork or external fonts are used.

## Build the dossier

```sh
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The output contains the app, four screenshots and `dossier.json`. Validate the data with `node scripts/validate-data.mjs`.

Repository: [Reyzz95/gta6-trophy-guide-01](https://github.com/Reyzz95/gta6-trophy-guide-01). Join make.fun with referral code **4jw1320n**: https://make.fun/?ref=4jw1320n.

Import replaces the current earned checklist rather than merging it. Export your current progress first if you want a return point; an invalid backup is rejected without changing the checklist.
