# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Claude Code plugin (`stardance-challenge-plugin`) built for Hack Club's Stardance challenge. It has two skills: `/devlog`, which reads a project's git history and writes a Stardance devlog entry directly, and `/readme`, which generates a Stardance-quality README grounded in a repo's actual files. Both run entirely inside the Claude Code session. There is no server, no CLI, and no external model call — an earlier Node/Express/OpenRouter version of `/devlog` was fully removed in favor of this.

There is no build, lint, or test tooling in this repo. The only "code" is the two skill definitions: [skills/devlog/SKILL.md](skills/devlog/SKILL.md) and [skills/readme/SKILL.md](skills/readme/SKILL.md). Working on this project means editing a skill file's rules and prose, then manually exercising the corresponding slash command against a real (or throwaway) git repo to verify behavior — there's no automated test suite.

## Repo layout

```
.claude-plugin/plugin.json      plugin manifest (name/description/version/author)
.claude-plugin/marketplace.json marketplace manifest so others can install this plugin
skills/devlog/SKILL.md          the /devlog skill: all its behavior lives here
skills/readme/SKILL.md          the /readme skill: all its behavior lives here
devlog.md                       committed, real devlog entries for this project
README.md                       this repo's own README, written by /readme
.devlog/                        gitignored, per-project local state (see below)
```

`.devlog/` (gitignored, created per-project on first `/devlog` run) holds:
- `memory.md` — running narrative summary of the project, written by the skill itself across runs, condensed when it exceeds ~40 lines
- `covered.txt` — full list of commit hashes already turned into a devlog entry (not a single "last covered" pointer — the user can select a subset of offered commits, so an older commit can remain uncovered after a newer one is written up)
- `config` — remembers the relative path to `devlog.md` so the skill doesn't ask every run

## Working on skills/devlog/SKILL.md

Three rules sit above everything else in the skill and take precedence over any other instruction in the file: never invent details not grounded in a commit/diff/user note, never describe a caught design issue as if it were a real failure ("realized/caught/noticed" vs "hit/broke/ran into"), and write in plain spoken language, not formal or documentation-style prose.

The skill runs through numbered steps (repo/git availability check → load `.devlog/memory.md` → find uncovered commits via `.devlog/covered.txt` → gather real diff/stat context per commit → draft the entry → run a 12-item self-check before showing output → save to `devlog.md` and update memory/covered-commits). If you change behavior in one step, check whether later steps assume the old behavior — they're written to depend on each other (e.g. Step 6's commit-hash bookkeeping depends on Step 2's full-list-not-marker approach).

The 12-item self-check list near the end of the file is the actual quality gate: a draft must be reread against it and rewritten before it's ever shown to the user, not shown flawed-then-fixed.

Known gaps: the tone-loosening change (allowing genuine excitement/frustration) hasn't been tested against a session with real emotional range, and merge-commit/binary-file handling paths are written but never actually exercised.

## Working on skills/readme/SKILL.md

One rule sits above everything else: never invent a feature, command, version, or setup step that isn't actually verifiable in the repo, an existing doc, or something the user has told you directly.

The skill runs through numbered steps (find repo root and check for an existing README → gather real signal from manifests/entry points/existing docs → ask the user for what the repo can't tell it → draft the 8 Stardance-guide sections in order → self-check → save). Steps depend on each other in one specific way worth knowing: Step 1 requires enumerating every sibling component (multiple skills, agents, packages, etc.) straight from the live directory listing rather than trusting an existing doc's claims about what exists, Step 3's Features section requires giving each of those components its own labeled bullet group (not just a passing mention elsewhere), and Step 4's self-check re-checks that same requirement as a second pass. If you touch the component-detection wording in Step 1, check that Step 3 and Step 4 still agree with it.

This skill was hardened through several rounds of manual testing that found real gaps: an early version silently dropped a second skill from a generated README because it trusted a stale doc's "one skill" claim over the actual directory listing; a follow-up version mentioned the second skill in prose but didn't give it Features bullets; the wording was then generalized so it isn't limited to just `skills/` folders.
