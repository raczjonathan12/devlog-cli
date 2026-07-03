---
name: devlog
description: Generate a Stardance devlog entry from recent git history. Use this whenever the user runs /devlog, asks to write a devlog, wants to document recent progress for Stardance, or asks to log/summarize what they just built. Always check for a project memory file and covered-commits list before starting.
argument-hint: "[optional note about what you worked on]"
disable-model-invocation: true
---

# Devlog

Write a grounded, honest, human-sounding Stardance devlog entry from the user's actual git history and real code changes. Never invent details. Never sound like an AI wrote it.

## Step 0: Confirm this is usable

Run `git rev-parse --show-toplevel` to find the actual repo root, don't assume the current directory is it. Use this root for all `.devlog/` file locations from now on.

If this fails (not a git repo), tell the user plainly that this needs to run inside a git repository and stop, don't try to run further git commands.

## Step 1: Load project memory

Look for `.devlog/memory.md` at the repo root. If it exists, read it first, it's a running summary of the project's story, past decisions, and past struggles, written by you on previous runs. Use it for context so you don't have to re-derive the whole project history from scratch every time.

If `.devlog/memory.md` is getting long (roughly over 40 lines), condense older entries into a shorter high-level paragraph before adding anything new, keep the last few runs in real detail and compress everything older than that. The file should stay useful context, not an ever-growing log.

If it doesn't exist, this is the first run. You'll create it at the end of this process.

## Step 2: Find new commits

Look for `.devlog/covered.txt` at the repo root, a plain list of commit hashes already covered by a previous devlog entry, one per line. If it doesn't exist, treat this as the first run and consider all commits.

Run `git log` and filter out any commit hash that already appears in `.devlog/covered.txt`. Don't rely on "everything after the last marker" as a cutoff, since the user can select a subset of commits to cover (see below), which means an older commit could still be uncovered even if a newer one was already written up. Checking against the full covered list handles this correctly regardless of which commits were picked in past runs.

Also check for uncommitted work with `git status --porcelain` and `git diff`. If there's meaningful uncommitted work, mention it to the user as an option, they may want it included and described as in-progress/uncommitted, separate from the finished commits. Don't silently ignore it, but don't assume they want it included either, ask.

Present the uncovered commits to the user in a short, readable way, not a raw log dump, grouped by rough time (this morning / yesterday / last session) with a plain-language one-line summary of each. Ask which commits to include (default to "all of them" as the easy option).

If the selected commits look like genuinely unrelated pieces of work, ask the user whether they want one combined devlog or separate ones. Don't decide this yourself.

If a selected commit is a merge commit, don't try to diff it directly, that diff is often huge or confusing since it's combining branches. Instead just note what was merged (branch name if available, and a rough sense of scale from `git show --stat`) rather than walking through its full content.

If a selected commit's diff is empty, whitespace-only, or otherwise a no-op, say so plainly rather than inventing significance for it, or just leave it out of the entry if it's not worth mentioning at all.

If this project has commits from more than one author, check `git log --format=%an` for the selected commits. If any weren't authored by the current user (compare against `git config user.name`), don't write "I did this" for that commit, ask the user how they want it handled instead.

Known limitation worth being aware of: the covered-commits list doesn't distinguish between branches. If the user works across multiple branches, a commit covered on one branch will be treated as covered everywhere, even if it doesn't appear on another branch's history. This is fine for typical single-branch usage but can get confusing with heavy branching, mention this to the user if you notice commits from an unfamiliar branch showing up unexpectedly.

## Step 3: Gather real context, not just stats

For each selected commit (excluding merge commits, handled above):
- The commit message
- `git show --stat <hash>` for a quick file-level view
- The actual diff (`git show <hash>`) for real content, not just line counts

Before pulling a full diff, check its rough size first (e.g. via the `--stat` output's line-change counts). If a single commit's diff is very large (roughly several hundred+ changed lines), don't load the whole thing into context, work from the file-stat summary and file names instead, and only pull specific portions of the diff if you genuinely need to check something specific.

If a changed file is binary (shown as `Bin` in `--stat` output, e.g. images, audio, video, compiled assets), don't attempt to diff it, there's nothing readable there. Just note that the file was added or changed by name and type.

Before including any diff content in what you show the user or write into the devlog, scan for anything that looks like a secret: API keys, tokens, passwords, connection strings, anything matching patterns like `KEY=`, `SECRET`, `TOKEN`, `password`, or a long random-looking string in a config-like context. If you spot something like this, do not reproduce it anywhere, not in the devlog text and not when summarizing the diff back to the user. Describe the change generically instead ("updated configuration"), and separately warn the user directly that the diff appears to contain something sensitive, so they can check whether it needs to be rotated or removed from history.

If you want to cite a specific number in the devlog (lines of code, file count, time spent, number of commits), only use a number you've actually verified from the data in this session, for example a real `git diff --stat` total. Never estimate, round up for effect, or invent a number that sounds plausible. If you don't have an exact figure and it would take real effort to compute one, describe the scale in words instead ("a small file," "most of the backend") rather than guessing a number.

Also use:
- The user's optional note (passed as an argument, or written directly in this conversation)
- Anything already discussed in this Claude Code session that's relevant

If you genuinely don't have enough to write something true and specific, ask the user directly rather than guessing or inventing. Use Claude Code's interactive question capability for this instead of just asking in prose, when there's a real decision to make, but don't overuse it for things you can reasonably infer from the data you already have.

## Step 4: Write the devlog

**What makes a good Stardance devlog** (this is the actual scoring criteria, not just style advice):

- Lead with what changed, first sentence, concretely. Never open with throat-clearing like "today I worked on" or "I made some progress."
- Include real friction. Voters score storytelling higher when there's a sense of struggle and resolution, not a clean success story. If something was hard, iterated on, or took a few tries, say so, based on what the diffs and commits actually show, not invented detail.
- It's fine, even good, if the work is messy or unrelated pieces stitched together. Don't force a tidy narrative that isn't there.
- No forced significance. Don't call ordinary work a "milestone" or say it "marks a moment." Just say what happened.
- Length is flexible, and it's fine for a devlog to run long if the work genuinely calls for it. The Stardance guide suggests 3-6 sentences as a rough starting point, not a ceiling. Prioritize being complete, specific, and grounded over hitting any particular count, but don't pad or repeat yourself just to sound thorough, every sentence should earn its place.
- Suggest one visual. End with a short, concrete suggestion for what screenshot, GIF, or clip would pair well with this entry. This is the single biggest predictor of a devlog getting attention, so don't skip it.

**Writing like a human, not an AI** (borrowed from how the humanizer skill catches AI writing patterns):

- Never use em dashes or double hyphens, in any form. Use a period, comma, or "and" instead.
- Avoid inflated or promotional words: "streamline," "showcase," "underscore," "robust," "seamless," "enhance," "leverage," "elevate," "unlock," "delve." Use plain verbs: made, fixed, changed, broke, added, moved.
- Avoid the rule of three, don't list exactly three examples or three adjectives or three items in a row, it's a recognizable AI tic. Watch for this even when fixing other issues in this list, it's easy to accidentally introduce a new rule-of-three while rewording something else.
- Don't hedge about the user's own actions from an outside, analytical view ("it looks like," "it seems," "this suggests"). Write like the user remembers doing it, because you're synthesizing this from their actual work, not observing it as an outsider.
- Numbers as digits, not spelled out words, if you need to reference a count at all, and avoid citing raw insertion/deletion counts directly, describe what the size of a change suggests about effort instead.
- Mixed, unresolved feelings read as human. Clean, neatly wrapped-up endings read as generated. It's fine to end on "still not quite right" or similar, if that's true.
- You may only describe events that are actually present in the commit messages, diffs, or the user's note. If it's not there, don't say it, even if it sounds plausible.
- Don't narrate the commit process itself ("in the commit before this one," "dropping in a manifest," "the commit right before"). The user doesn't think in commits when they talk about their work, they think in features and decisions. Describe what was built or changed, not how git recorded it.
- Match a serious, focused teen builder's voice: direct, plain, confident about the work, not corporate or documentation-style, and not slangy or trying to sound cool either. No "dropping in," "shipping it through," or similar casual-technical filler phrasing.
- Say what the feature or decision actually was in plain terms first, technical detail (file names, specific tools) only if it's the actual point being made, not just background color.
- Bad (too technical/documentation-style): "The skill walks through reading git history, checking a memory file for project context, and writing the devlog entry directly inside a Claude Code session." Good (plain, direct): "I built the devlog tool as a Claude Code skill now instead of a separate app. It reads your commits itself and writes the entry right there, no server needed."
- Avoid inflated or promotional words: "streamline," "showcase," "underscore," "robust," "seamless," "enhance," "leverage," "elevate," "unlock," "delve." Also avoid stock phrases that show up constantly in AI writing even when told to sound human, like "gut check," "moving parts," "Rube Goldberg machine," or similar reached-for metaphors. If a phrase feels like something you'd see in a dozen other AI-written summaries, replace it with something plainer and more specific to what actually happened.

**Before finalizing, check the draft against this list.** Write a draft first, then re-read it specifically looking for these five things, in order. If you find any, rewrite the affected sentence before showing it to the user, don't just note the problem and leave it:

1. Does any sentence mention "the commit," "this commit," or narrate git actions (adding, removing, pulling something out "in a commit")? Rewrite it to describe the actual feature or decision instead.
2. Does any sentence list exactly three of anything (three examples, three words separated by commas or slashes, three short clauses in a row)? Break the pattern, either drop one item, merge two together, or restructure as two separate sentences.
3. Does any sentence contain an em dash or double hyphen?
4. Does the entry explain its own structure or process the way documentation would ("the file lays out," "the process checks for," "walks through")? Rewrite to describe what was built or decided, not how the skill itself works step by step.
5. Does any sentence use a banned filler word from the list above?

Only show the user the version that's already passed this check, don't show a draft and then a separate corrected version, just do the check silently and present the final result.

## Step 5: Save the devlog

The first time this skill runs in a project, ask the user where `devlog.md` should live (suggest the repo root as a default). Remember this choice by writing it to `.devlog/config`, and check that file on future runs so you don't ask again. Store the path relative to the repo root found in Step 0, not an absolute path, so it stays valid if the project folder ever moves.

Append the new entry to that file, using this markdown formatting:
- A `##` heading with the date for each entry
- **Bold** for the single most important phrase in the entry (usually the first sentence's core change)
- A short italic line at the end for the visual suggestion

Then print the same entry directly in the conversation as well, so the user can copy it to Stardance immediately without opening the file.

## Step 6: Update memory and covered commits

- Update `.devlog/memory.md` with a short addition summarizing what this entry covered, so future runs have this context without re-deriving it from scratch. Condense older content per the note in Step 1 if the file is getting long.
- Append every commit hash actually covered in this run to `.devlog/covered.txt`, one per line. Append, don't overwrite, since past runs' coverage still matters for future filtering.

## Notes

- Run git commands directly, don't ask permission for each one, only pause to ask the user something when you're genuinely missing information you can't get from the repo itself.
- `.devlog/` files are project-local config and memory, not something to commit to the user's actual project git history unless they ask, suggest adding it to `.gitignore` on first run if it isn't already covered.
