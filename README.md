# gta6-trophy-guide-clean
[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/tmobgtt/gta6-trophy-guide-clean/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/tmobgtt/gta6-trophy-guide-clean/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Legend is an offline trophy guide and tracker for Grand Theft Auto VI on PlayStation 5. It covers all 55 official trophies — 1 platinum, 2 gold, 6 silver and 46 bronze — each shown with its official name, description and grade exactly as PlayStation publishes them, plus a guide written for this entry in its own words that names its sources beside it (Exophase, PSNProfiles, PowerPyx and the PlayStation official trophy list).

The guide is built from the official descriptions: a six-stage roadmap to the platinum (story first, strangers and Leonida locals, one-off moments before the finale, collections and Leonida coverage, grinds and mastery, then the 100% endgame), a missables panel flagging every trophy that a single scene, place, choice or sequence can lose, and the tracked target for every count-based trophy — 42 Shooting Range challenges, 250 stunts, 100 vehicles, 52 areas, 500 choices and more.

## Run it

```
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step and no network are needed after that: the app is plain static files under `app/`, and `node main.ts` hands the entry in by copying `app/` and `screenshots/` to the output directory and writing its dossier.

## Features

- Checklist over all 55 trophies with progress saved in the browser (localStorage), a progress header with percentage and per-grade counts, and export of progress to a JSON file plus import back from a file
- A full guide for every trophy: what to do, where and when, built from its official description, with its sources cited beside the guide
- Filters by kind (story, missable, collectibles, activities, and online — the official PS5 list names no online trophies, and the app says so honestly), by grade, plus search and a hide-earned toggle
- A spoiler shield that hides the names and descriptions of story trophies until they are earned
- A roadmap view with the six stages to the platinum, per-stage trophy chips and earned counts, and a missables panel listing every missable with its caution
- A detail panel for every trophy with its target, roadmap stage, missable caution and source links
- Works fully offline with the network off; no external fonts, images or libraries, and no official artwork

Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards
