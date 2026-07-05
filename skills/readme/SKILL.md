---
name: readme
description: Use when the user runs /readme, asks to write or improve a project's README, or wants help documenting a project for Stardance judges and visitors.
argument-hint: "[optional note, e.g. demo link or what to focus on]"
disable-model-invocation: true
---

# Readme

Write a real, grounded README for this project, based on Stardance's guide to a great README, structured so a stranger with no context can understand and try the project.

One rule sits above everything else in this file. If anything below ever seems to conflict with it, it wins.

Never invent a feature, command, version number, or setup step that isn't actually verifiable in the repo, an existing doc, or something the user has told you directly. If you can't verify it, ask instead of guessing or writing something that merely sounds plausible.

## Step 0: Find the repo root and check for an existing README

Run `git rev-parse --show-toplevel` to find the actual repo root, don't assume the current directory is it. If this isn't a git repository, that's fine, README generation doesn't require git, just use the current directory as the root and skip anything git-derived later on.

Check for a `README.md` at that root.

If one exists, read it and give the user a short summary of what sections it already covers. Ask whether to rewrite it fully, only fill in sections that are missing or clearly stale, or leave it as is. Don't silently overwrite an existing file.

If none exists, this is a first write, continue normally.

## Step 1: Gather real signal from the repo

Look for whatever manifest or config files actually exist to ground language, dependencies, and real run commands. `package.json` (including its `scripts` and `engines`), `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, `Gemfile`, or similar. Only use what's actually there, don't assume a stack the repo doesn't show signs of.

Look at the top-level file and folder layout for an actual entry point, a main file, `src/`, `bin/`, an index file, whatever the project's real structure shows.

If the project is made up of multiple sibling items of the same kind sitting in the same parent folder, skills, agents, commands, hooks, packages in a monorepo, services, or any other repeated unit the project's own structure uses, list every one of them straight from the current directory listing itself. Treat that listing as the actual source of truth for what exists right now.

Look for existing docs already in the repo, an existing README, `CONTRIBUTING`, `LICENSE`, `CLAUDE.md`, `AGENTS.md`, or similar, and reuse accurate information from them, things like why a decision was made, what a component is for. But existing docs describe the project as of whenever they were last written, not necessarily now. Where a doc makes a claim about what components exist, how many, which ones, cross-check that claim against the live directory listing before repeating it. If the doc and the directory listing disagree, the directory listing wins, and it's worth mentioning to the user that the doc looks out of date.

If a `.devlog/memory.md` happens to exist, you can use it for descriptive context, what the project is about, notable design decisions, but don't depend on it. This skill has to work fine in a repo where `/devlog` has never been run.

Keep a running sense of what you actually know versus what's still missing. Don't fill gaps with a guess just because a guess would sound fine.

## Step 2: Ask for what the repo can't tell you

Some things genuinely can't come from reading code. Ask the user directly, batched into one reasonable set of questions rather than a long back-and-forth:

- Is there a live demo or "try it" URL? If not yet, that's fine, note it as not available rather than inventing one.
- Is there a screenshot, GIF, asciinema recording, or photo that shows the project in action, or should one still be captured? Don't fetch, generate, or fabricate a visual yourself, just find out what exists or should exist and reference it, the same way the devlog skill never auto-inserts real links.
- Anyone or anything to credit, other people's code, libraries doing real heavy lifting, inspiration worth naming.
- Any deliberate design decision or tradeoff worth explaining in "how it works," beyond what's obvious just from reading the code. Confirm this with the user even where you could infer it, since the intent behind a decision matters more here than the mechanism.

If the repo genuinely doesn't have enough to write a real Quick Start or Features section, for example no manifest and no discoverable entry point, say that plainly and ask rather than guessing at what the project probably does.

## Step 3: Draft the README

Write the sections in this order:

1. Title and a one-sentence, human-readable description of what the project actually is. Not internal implementation detail, and don't assume the reader already knows what Stardance is.
2. The visual, referenced or placed per what the user said in Step 2. If there isn't one yet, say so plainly rather than skipping the section entirely.
3. The "try it" link, made prominent, if one exists.
4. Quick Start, the shortest real path from curious to running. Aim for three commands or fewer. If the project genuinely can't be started in three commands, that's fine, just say so plainly instead of forcing a fake shortcut.
5. Features, a scannable list of specific, verifiable capabilities. No marketing language, "streamline," "seamless," "powerful," describe what it actually does. If the project has multiple sibling components (see Step 1), give every single one of them its own labeled bullet or sub-group right here in this list, not just a passing mention somewhere else in the README, each component from the Step 1 listing needs at least one bullet of its own before this section counts as done. With one component, 3 to 7 bullets is a good range; with several components, let the count grow to fit, don't compress multiple components down to fit a target count.
6. Local setup, real language/runtime versions, system dependencies, environment variables with real examples, and the exact commands to start it, all grounded in what Step 1 actually found.
7. How it works, the interesting technical decisions and tradeoffs behind the project, not just a list of libraries used.
8. Credits and acknowledgements, per what the user said in Step 2.

## Step 4: Self-check before showing the draft

Reread the draft against this list before showing it to the user. Fix anything you find, don't show a flawed draft and then a fixed one, only show the version that's already passed.

1. Any leftover template or boilerplate text still sitting in the draft?
2. Does it assume the reader already knows what Stardance or this challenge is?
3. Is there an actual visual referenced, not just silently skipped?
4. Do the setup instructions match what was actually verified in Step 1, not something stale or guessed?
5. Is there a real demo link, not just a link back to the GitHub repo itself?
6. Any feature, command, or number in the draft that isn't actually grounded in the repo or something the user confirmed?
7. If Step 1 found multiple sibling components, does every single one of them actually have its own labeled bullet group under Features, not just a mention somewhere else in the draft?

## Step 5: Save

Write the result to `README.md` at the repo root, or wherever Step 0 confirmed if the project already had one somewhere else. Print the same content in the conversation too.

If this was a rewrite or partial update of an existing file, mention briefly what changed, don't make the user diff it themselves to find out.
