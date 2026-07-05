# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Claude Code plugin (`stardance-challenge-plugin`) built for Hack Club's Stardance challenge. It has one skill, `/devlog`, which reads a project's git history and writes a Stardance devlog entry directly, entirely inside the Claude Code session. There is no server, no CLI, and no external model call — an earlier Node/Express/OpenRouter version was fully removed (see `claude-context.md` for why).

There is no build, lint, or test tooling in this repo. The only "code" is the skill definition itself: [skills/devlog/SKILL.md](skills/devlog/SKILL.md). Working on this project means editing that file's rules and prose, then manually exercising `/devlog` against a real (or throwaway) git repo to verify behavior — there's no automated test suite.

## Repo layout

```
.claude-plugin/plugin.json   plugin manifest (name/description/version)
skills/devlog/SKILL.md       the entire skill: all behavior lives here
devlog.md                    committed, real devlog entries for this project
.devlog/                     gitignored, per-project local state (see below)
claude-context.md            longer-form project history/rationale, read this for background
```

`.devlog/` (gitignored, created per-project on first `/devlog` run) holds:
- `memory.md` — running narrative summary of the project, written by the skill itself across runs, condensed when it exceeds ~40 lines
- `covered.txt` — full list of commit hashes already turned into a devlog entry (not a single "last covered" pointer — the user can select a subset of offered commits, so an older commit can remain uncovered after a newer one is written up)
- `config` — remembers the relative path to `devlog.md` so the skill doesn't ask every run

## Working on SKILL.md

Three rules sit above everything else in the skill and take precedence over any other instruction in the file: never invent details not grounded in a commit/diff/user note, never describe a caught design issue as if it were a real failure ("realized/caught/noticed" vs "hit/broke/ran into"), and write in plain spoken language, not formal or documentation-style prose.

The skill runs through numbered steps (repo/git availability check → load `.devlog/memory.md` → find uncovered commits via `.devlog/covered.txt` → gather real diff/stat context per commit → draft the entry → run a 12-item self-check before showing output → save to `devlog.md` and update memory/covered-commits). If you change behavior in one step, check whether later steps assume the old behavior — they're written to depend on each other (e.g. Step 6's commit-hash bookkeeping depends on Step 2's full-list-not-marker approach).

The 12-item self-check list near the end of the file is the actual quality gate: a draft must be reread against it and rewritten before it's ever shown to the user, not shown flawed-then-fixed.

Known gaps (see `claude-context.md`, "Open item" and "Not yet tested at all" sections): the recent tone-loosening change (allowing genuine excitement/frustration) hasn't been tested against a session with real emotional range, and merge-commit/binary-file handling paths are written but never actually exercised.
