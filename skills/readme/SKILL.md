---
name: readme
description: Use when the user runs /readme, asks to write or improve a project's README, or wants help documenting a project for Stardance judges and visitors.
argument-hint: "[optional note, e.g. demo link or what to focus on]"
---

# Readme

Write a real, grounded README based on Stardance's guide to a great README, structured so a stranger with no context can understand and try the project.

One rule outranks everything else: never invent a feature, command, version number, or setup step that isn't actually verifiable in the repo, an existing doc, or something the user told you directly. If you can't verify it, ask.

## Step 0: Find the repo root and check for an existing README

Run `git rev-parse --show-toplevel` for the real root (don't assume cwd). If not a git repo, that's fine, use cwd and skip anything git-derived. Check for `README.md` there. If one exists, summarize what it covers and ask whether to rewrite fully, fill in missing/stale sections only, or leave as is, never silently overwrite. If none exists, this is a first write.

## Step 1: Gather real signal from the repo

Look for whatever manifests actually exist (`package.json` with its `scripts`/`engines`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, `Gemfile`, etc.), don't assume a stack the repo doesn't show. Look at the top-level layout for a real entry point (`src/`, `bin/`, an index file).

If the project has multiple sibling items of the same kind in one parent folder (skills, agents, commands, hooks, packages in a monorepo, services, or any other repeated unit), list every one straight from the current directory listing, that listing is the source of truth for what exists now.

Reuse accurate info from existing docs (README, CONTRIBUTING, LICENSE, CLAUDE.md, AGENTS.md), things like why a decision was made. But a doc only reflects whenever it was last written, so cross-check any claim it makes about what components exist against the live directory listing, the listing wins on disagreement, and mention it if the doc looks out of date.

`.devlog/memory.md`, if present, is fine for descriptive context but this skill must work fine without `/devlog` ever having run. Keep track of what's actually known versus missing, don't fill gaps with a guess just because it'd sound fine.

## Step 2: Ask for what the repo can't tell you

Batch into one set of questions rather than a long back-and-forth:

- Live demo/"try it" URL? Not yet is fine, note it as unavailable rather than inventing one.
- Screenshot/GIF/recording/photo, existing or still to capture? Don't fetch, generate, or fabricate one yourself, just find out what exists or should exist and reference it.
- Anyone/anything to credit.
- Any deliberate design decision or tradeoff worth explaining in "how it works" beyond what's obvious from code, confirm even where inferable, intent matters more here than mechanism.

If there's genuinely not enough for a real Quick Start or Features section (no manifest, no discoverable entry point), say so and ask rather than guessing what the project probably does.

## Step 3: Draft the README

Sections, in this order:

1. Title and a one-sentence, human-readable description, not internal implementation detail, don't assume the reader knows what Stardance is.
2. The visual, per what the user said in Step 2, say so plainly if there isn't one yet rather than skipping the section.
3. The "try it" link, made prominent, if one exists.
4. Quick Start, the shortest real path from curious to running, aim for three commands or fewer, say so plainly if it genuinely can't be that short rather than forcing a fake shortcut.
5. Features, a scannable list of specific, verifiable capabilities, no marketing language ("streamline," "seamless," "powerful"). If there are multiple sibling components (Step 1), every one needs its own labeled bullet/sub-group right here, not just a mention elsewhere, before this section counts as done. One component: 3-7 bullets is a good range. Several: let the count grow to fit, don't compress to hit a target.
6. Local setup: real versions, dependencies, env vars with real examples, exact start commands, all grounded in Step 1.
7. How it works: the interesting technical decisions and tradeoffs, not just a list of libraries.
8. Credits, per Step 2.

**Writing like a human, not an AI** (same rules that keep devlog entries from sounding generated apply here, a README is still read by a real person):

- Never use em dashes or double hyphens, use a period, comma, or "and."
- Avoid inflated/promotional words (streamline, showcase, underscore, robust, seamless, enhance, leverage, elevate, unlock, delve), use plain verbs (made, fixed, added, runs, reads, writes). Avoid stock AI phrases (gut check, moving parts, or similar reached-for metaphors).
- Watch for jargon needing full project context ("guardrail," "architecture," "infrastructure"), use plain words ("a rule," "a check," "the setup") so a stranger can follow.
- Avoid the rule of three (exactly three examples/adjectives/clauses in a row), a recognizable AI tic, watch for it even while fixing other issues in the same sentence.
- Numbers as digits, not spelled out.

## Step 4: Self-check before showing the draft

Reread and fix before showing, never show a flawed draft then a fixed one:

1. Leftover template/boilerplate text?
2. Assumes the reader knows what Stardance is?
3. Actual visual referenced, not silently skipped?
4. Setup instructions match what Step 1 actually verified, not stale/guessed?
5. Real demo link, not just a link back to the GitHub repo?
6. Any feature/command/number not grounded in the repo or user confirmation?
7. If Step 1 found multiple sibling components, does every one have its own labeled Features bullet group, not just a mention elsewhere?
8. Any em dash, double hyphen, inflated/promotional word, stock AI phrase, unneeded jargon, or rule-of-three list?

## Step 5: Save

Write to `README.md` at the repo root (or wherever Step 0 confirmed). Print the same content in the conversation. If this was a rewrite/partial update, briefly mention what changed, don't make the user diff it themselves.
