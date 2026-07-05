# Project context: devlog-cli / stardance-challenge-plugin

## What this project is

A Stardance challenge project. Started as a standalone Node CLI (Commander) talking to an Express backend, which called Hack Club's AI proxy (via the OpenRouter SDK) to generate devlog entries from git history.

That approach was fully removed. The project is now a Claude Code plugin called `stardance-challenge-plugin`, with a single skill, `/devlog`, that reads git history and writes the devlog entry directly inside a Claude Code session. No server, no external model call.

## Why the pivot happened

The CLI/backend version worked, but small free-tier models (Qwen variants, Llama 3.3, Gemma variants) kept either fabricating details, hedging in an unnatural analytical voice ("it looks like I had to rewrite..."), or hitting rate limits across multiple providers in the same session. Extensive prompt tuning improved but didn't fully fix this. Decided Claude Code's own model, running as a skill, would follow grounding and tone rules more reliably than a cheap routed model, and removes the need for an API key, a server, and model fallback logic entirely.

## Current structure

```
devlog-cli/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── devlog/
│       └── SKILL.md
├── devlog.md          (committed, real devlog entries live here)
├── .gitignore         (.env, node_modules, .devlog/)
└── README.md
```

`.devlog/` (gitignored, local only) holds:
- `memory.md` — running project narrative, condensed if it exceeds ~40 lines
- `covered.txt` — every commit hash already covered by a past devlog entry (a full list, not a single "last covered" marker, so partial commit selection works correctly)
- `config` — remembers where `devlog.md` lives so the skill doesn't ask every time

## Key design decisions baked into the skill

- Tracks all covered commits as a list, not a single marker, because the user can select a subset of offered commits, and a single "last covered" pointer breaks if an older commit gets skipped.
- Reads real diffs, not just `--stat` summaries, for actual grounded content, but caps diff size for very large commits and skips diffing binary files entirely.
- Scans diffs for anything that looks like a secret (API keys, tokens, passwords) before it can leak into a devlog or into what's shown in chat.
- Handles merge commits (summarized, not diffed directly), commits from other authors (asks rather than assuming), corrupted/missing memory file, and a deleted `devlog.md` path.
- A 12-item self-check pass runs after drafting, before showing output, checking for: mislabeling a design decision as a "bug that happened," commit-process narration, rule-of-three, em dashes, documentation-style self-explanation, banned filler/jargon words, unverified numbers, unverified testing claims, silently merged unrelated work, overly formal/literary phrasing, changelog-style lists, and flat/forced tone.
- Tone was recently loosened: genuine excitement or genuine frustration is now allowed and encouraged if it's real, matching patterns seen in popular real Stardance devlogs. What's still banned is *forced* enthusiasm with nothing behind it, and swinging back into corporate/documentation voice.
- Default output format is short, punchy standalone lines with blank lines between them, not dense flowing paragraphs, again matching what popular real devlogs look like.
- Deliberately does not fetch or insert real links (repo, demo) automatically, just suggests a visual. This was a deliberate choice, not an oversight.

## Testing history worth knowing

Multiple test runs surfaced and fixed, in order: overly technical/documentation-style voice, unwanted slang, fabricated details not in the source data, em dashes despite explicit rules, rule-of-three violations, and the most important one, describing something caught during design review as if it had actually failed during a real run ("I hit a problem" vs "I realized/caught a problem"). A separate self-run "LLM council" exercise (five simulated advisor perspectives, no external API) surfaced three more additions: a jargon check, a list-flattening check, and a check for two disconnected chunks of work silently merged into one entry.

## Open item, not yet resolved

The tone-loosening change (genuine excitement/frustration allowed) has not been properly tested yet. Every real test run so far has happened to involve fairly neutral work (editing the skill file itself), so it's unconfirmed whether the skill actually lets itself sound excited or frustrated when a session genuinely was, versus defaulting back to flat neutral phrasing out of habit. This needs a real test against a session with actual emotional range in it, something that was either genuinely satisfying or genuinely frustrating, not just accurate.

## Not yet tested at all

Merge commit handling and binary file handling are written into the skill but have never actually been exercised in a real run.
