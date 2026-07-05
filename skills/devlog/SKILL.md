---
name: devlog
description: Use when the user runs /devlog, asks to write a devlog, wants to document recent progress for Stardance, or asks to log/summarize what they just built.
argument-hint: "[optional note about what you worked on]"
---

# Devlog

Write a grounded, honest, human-sounding Stardance devlog entry from the user's actual git history and real code changes.

Three rules outrank everything else here:

1. Never invent details. Only describe what actually appears in a commit message, a diff, the user's note, or something said directly in this conversation. A genuine feeling ("today was a good day") is fine if it's a real read on what happened, not a fabricated event.
2. Never describe a design decision or something caught during review as if it were a bug that actually happened. If a problem was caught by thinking ahead or reading code, say "realized," "caught," "noticed," not "hit," "ran into," "broke." Those words only belong to things that actually failed during a real run.
3. Write in plain, everyday language, the way you'd tell a friend what you did, not a formal or essay-like write-up. If a sentence sounds like a spec or a motivational post, rewrite it plainer.

## Step 0: Confirm this is usable

Run `git rev-parse --show-toplevel` for the real repo root (don't assume cwd), use it for every `.devlog/` file. If it fails or git isn't available, say so plainly and stop.

## Step 1: Load project memory

Read `.devlog/memory.md` at the repo root if it exists, it's a running summary from past runs, use it instead of re-deriving history each time. If it's empty/corrupted, treat as absent and mention it looked off, don't fail the run. If it's over ~40 lines, condense older entries into a shorter paragraph before adding new content. If absent, this is the first run, you'll create it at the end.

## Step 2: Find new commits

Read `.devlog/covered.txt` (one hash per line, absent = first run = all commits eligible). Run `git log`, excluding hashes already in that file. Check the *full list* every time, not "everything after the last covered one", since the user can select a subset in any given run, leaving older commits uncovered even after newer ones are written up. For long histories, default to a recent window (~200 commits), go further back only if asked.

Also check `git status --porcelain` and `git diff` for uncommitted work (porcelain catches new untracked files diff alone would miss). If there's meaningful uncommitted work, ask whether to include it as in-progress. If included, it has no hash for `covered.txt`, note in `memory.md` instead that this session's uncommitted work is already covered, so a later run doesn't redo it once it's committed.

Present uncovered commits grouped by rough time (this morning, yesterday, last session) with a one-line summary each, not a raw log dump. Ask which to include, defaulting to all. For near-identical or generic messages ("fix", "wip"), use the diff to tell them apart, ask if it still doesn't clarify. If selected commits look like unrelated pieces of work, ask whether to combine into one entry or split, don't decide yourself.

Merge commits: don't diff directly (often huge/confusing), just note what was merged, branch name if available, and rough scale from `git show --stat`. Don't guess a branch name if unavailable (e.g. detached HEAD), just describe it as a merge.

A no-op diff (empty/whitespace-only): say so plainly or leave it out, don't invent significance.

Multiple authors: check `git log --format=%an` against `git config user.name`. Don't write "I did this" for commits by someone else, ask how to handle it, since a name mismatch can also happen innocently (different machine/config).

Note: the covered-commits list doesn't distinguish branches, a commit covered on one branch counts as covered everywhere. Fine for single-branch use; mention the limitation if commits from an unfamiliar branch show up unexpectedly.

## Step 3: Gather real context, not just stats

For each selected non-merge commit: the commit message, `git show --stat <hash>`, and the actual diff via `git show <hash>`.

Check size from `--stat` first. For very large diffs (roughly several hundred+ changed lines), work from the file-stat summary and names instead of pulling the whole diff, only fetch specific portions if genuinely needed. Binary files (`Bin` in `--stat`): don't diff, just note added/changed by name and type.

Before including any diff content anywhere (entry or chat), scan for secrets, API keys, tokens, passwords, connection strings, `KEY=`/`SECRET`/`TOKEN`/`password` patterns, long random-looking strings in config context. If found, don't reproduce it, describe that part generically ("updated configuration") and tell the user directly it looked sensitive so they can rotate/scrub it.

Any cited number (lines of code, file count, time, commit count) must be verified from data actually pulled this session (e.g. a real `git diff --stat` total), never estimated, rounded for effect, or taken from something the user pasted without checking. If a real figure isn't worth computing, describe scale in words ("a small file") instead of guessing a number. Apply the same scrutiny to any outside feedback (another AI, a friend) the user shares, don't adopt a number or claim from it unless independently grounded.

Also use the user's optional note/argument and anything already discussed this session. If there's genuinely not enough to write something true and specific, ask rather than guess.

## Step 4: Write the devlog

**What actually gets scored:**

- Lead with what changed, concretely, first thing said. No "today I worked on" throat-clearing.
- Include real friction if the diffs/commits actually show it, struggle-then-resolution scores higher than a clean success story, but never call a caught design issue a bug per Rule 2.
- Messy or unrelated-pieces-stitched-together is fine, don't force a tidy narrative that isn't there.
- No forced significance, don't call ordinary work a milestone.
- Length is flexible; 3-6 sentences is a starting point not a ceiling. Prioritize complete/specific/grounded over any count, but don't pad.
- Default to short, punchy lines with blank lines between them (one idea per line), not one dense paragraph, e.g.:

  Got the scrollbar and bookmarks working today.

  Ran into a bunch of bugs along the way, especially with the scrollbar, but it's solid now.

  The browser part is still behind, want to fix that next.

  A full paragraph is fine only if the content genuinely flows better that way.
- Two genuinely disconnected chunks of work (not already split in Step 2): say so, add a time connector ("later that day"), or ask about splitting into two entries. Don't blur them into one continuous story.
- End with one concrete visual suggestion (screenshot/GIF/clip), this is the single biggest predictor of a devlog getting attention, don't skip it.

**Writing like a human, not an AI:**

- Never use em dashes or double hyphens. Use a period, comma, or "and."
- Avoid inflated/promotional words (streamline, showcase, underscore, robust, seamless, enhance, leverage, elevate, unlock, delve), use plain verbs (made, fixed, changed, broke, added, moved). Avoid stock AI phrases (gut check, moving parts, Rube Goldberg machine, or similar reached-for metaphors).
- Avoid jargon/abstractions that need full project context ("guardrail," "architecture," "infrastructure"), use plain words ("a rule," "a check," "the setup") so a stranger can follow.
- Past three items in a list: check if it reads like a person talking or like a changelog, group loosely instead of listing every item.
- Avoid the rule of three (exactly three examples/adjectives/clauses in a row), it's a recognizable AI tic, watch for it even while fixing other issues in the same sentence.
- Match how the user actually feels, genuine excitement or annoyance is fine and good when real, the same way popular devlogs sound genuinely pumped or annoyed rather than neutral. Not fine: forced enthusiasm, or swinging into stiff corporate/documentation voice.
- Don't hedge about the user's own actions from an outside view ("it looks like," "it seems"), write like they remember doing it.
- Numbers as digits, not spelled out. Describe what a diff's size suggests rather than citing raw insertion/deletion counts.
- Mixed, unresolved feelings read as human; a too-neat ending reads as generated. "Still not quite right" is a fine ending if true, so is real satisfaction if true.
- Don't narrate the commit process ("in the commit before this one," "dropping in a manifest"), describe what was built or decided, the user thinks in features, not commits.
- State the feature/decision in plain terms first, technical detail only if it's the actual point.

Bad (too technical/documentation-style): "The skill walks through reading git history, checking a memory file for project context, and writing the devlog entry directly inside a Claude Code session." Good: "I built the devlog tool as a Claude Code skill now instead of a separate app. It reads your commits itself and writes the entry right there, no server needed."

Bad (too formal/literary): "Since the whole point is not inventing drama that didn't occur." Good: "So the devlog doesn't make things sound worse than they actually were."

**Before finalizing, draft first, then reread against this list, rewriting any hit before showing the user (never show a flawed draft then a fixed one):**

1. Any sentence calling a caught design issue a bug ("hit," "ran into," "broke" for something never actually triggered)? Reword to "realized/caught/noticed."
2. Any sentence narrating git actions directly ("the commit," "this commit")? Rewrite around the actual feature/decision.
3. Any sentence listing exactly three of anything? Drop one, merge two, or split into two sentences.
4. Any em dash or double hyphen?
5. Does the entry explain its own structure like documentation ("the file lays out," "walks through")? Rewrite around what was built/decided.
6. Any banned filler word or stock phrase from the list above?
7. Any specific number that wasn't actually verified this session?
8. Any claim of testing/checking/verifying that wasn't actually run this session?
9. Two genuinely disconnected chunks of work with nothing tying them together? Add a connector or flag it.
10. Any big, formal, or literary word/phrasing where a plain one would say the same thing?
11. Any list past three items reading like a changelog? Loosen into a grouped phrase.
12. Does the entry sound flat when the work clearly went well or badly? Match the real feeling, don't default neutral, don't fake enthusiasm.

## Step 5: Save the devlog

First run: ask where `devlog.md` should live (repo root as default), remember the choice in `.devlog/config` as a relative path (not absolute, so it survives the project moving). Read that file on later runs instead of asking again. If the recorded path no longer exists, say so and confirm where it should go now, don't silently recreate it.

Append using: a `##` date heading per entry (multiple headings for the same day are fine and expected), **bold** for the single most important phrase (usually the first line), short lines with blank lines between for the body (per the punchy format above, unless prose genuinely flows better), a short italic line at the end for the visual suggestion. Then print the same entry in the conversation too.

## Step 6: Update memory and covered commits

Add a short summary of what this entry covered to `.devlog/memory.md` (condense per Step 1 if long). Append (never overwrite) covered commit hashes to `.devlog/covered.txt`, one per line. If uncommitted work was included, don't add anything to `covered.txt` for it (no hash), note it in `memory.md` per Step 2 instead.

## Notes

Run git commands directly, don't ask permission per command, only ask when genuinely missing information the repo can't provide.

Both `.devlog/` and `devlog.md` are local only (personal notes, not project source), suggest gitignoring both on first run if not already covered.

Back-to-back `/devlog` runs are already handled correctly by Step 2's covered-commits check, no extra handling needed.
