// Roadmap data for Leonida Legend: six stages to the platinum, built only from the official
// trophy descriptions (story chapters and named missions, stranger strands, the one-off
// moments hidden in the descriptions, the tracked counts, 100% completion, then platinum).
// Each stage lists the trophy ids from app/data/trophies.json that belong to it; the app
// renders per-stage chips and counts from the trophies' own "stage" fields, which match this.

export const ROADMAP_STAGES = [
  {
    n: 1,
    title: 'Story first',
    summary:
      'Play the main story in order: the opening mission Gone Fishing, Chapters 1 to 4, and the named missions ' +
      'Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown and Operation Savage Glory. ' +
      'Keep the spoiler setting on and this stage stays spoiler-safe: no story detail beyond the official descriptions.',
  },
  {
    n: 2,
    title: 'Strangers & Leonida locals',
    summary:
      'Finish the stranger strands across Leonida: the final missions for Andy, Kenton, Billy, Randy and Tyrone, ' +
      'the silver Strangers & Freaks count of 8 strands, and Bret\u2019s unique-animal hunt.',
  },
  {
    n: 3,
    title: 'One-off moments before the finale',
    summary:
      'Before the final mission, clear the moments the descriptions tie to one scene, one place or one choice: ' +
      'the Ocean Beach cocktail, the showroom smash, the bowling follow-through, the VCIA departure, a second-try ' +
      'success, the strange event, the partnership moments, the 500 tracked choices and the two partner free-roam sequences.',
  },
  {
    n: 4,
    title: 'Collections & Leonida coverage',
    summary:
      'Sweep the state: 3 Collectible Card sets, WAiNK It at 100 locations, 18 meditation spots, 100 discovered ' +
      'vehicles, all 52 areas of Leonida, 10 Scooter Bros registrations and one Illegal Operation robbed for each of the 9 gangs.',
  },
  {
    n: 5,
    title: 'Grinds & mastery',
    summary:
      'The long counts and the skill tests: 250 stunts, gold in all 42 Shooting Range challenges, drone race wins at ' +
      '14 locations, 20 different race wins, 50 challenges, 9 activity types, 5 bank vaults, $250,000 laundered and ' +
      '$100,000 spent, and all 8 garage properties.',
  },
  {
    n: 6,
    title: 'Endgame: 100%, then platinum',
    summary:
      'Close out A Long Road at 100% completion using the in-game counter against this checklist; when every other ' +
      'trophy is earned, Vice Got a Price! — the platinum — is awarded automatically.',
  },
];

export function stageFor(stageNumber) {
  return ROADMAP_STAGES.find((s) => s.n === stageNumber) ?? ROADMAP_STAGES[0];
}
