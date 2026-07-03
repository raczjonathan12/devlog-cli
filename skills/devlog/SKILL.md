---
name: devlog
description: Generate a Stardance devlog entry from recent git history. Use this whenever the user runs /devlog, asks to write a devlog, wants to document recent progress for Stardance, or asks to log/summarize what they just built. Always check for a project memory file and a commit marker before starting.
argument-hint: "[optional note about what you worked on]"
disable-model-invocation: true
---

# Devlog

Write a grounded, honest, human-sounding Stardance devlog entry from the user's actual git history and real code changes. Never invent details. Never sound like an AI wrote it.

## Step 1: Load project memory

Look for `.devlog/memory.md` in the current repo. If it exists, read it first, it's a running summary of the project's story, past decisions, and past struggles, written by you on previous runs. Use it for context so you don't have to re-derive the whole project history from scratch every time.

If it doesn't exist, this is the first run. You'll create it at the end of this process.

## Step 2: Find new commits

Look for `.devlog/marker` in the current repo, it holds the hash of the last commit already covered by a devlog. If it doesn't exist, treat this as the first run and consider all commits.

Run `git log` to find commits after the marker. Present them to the user in a short, readable way, not a raw log dump, e.g. grouped by rough time (this morning / yesterday / last session) with a plain-language one-line summary of each, not the raw commit message. Ask the user which commits to include (default to "all of them" as the easy option).

If the selected commits look like genuinely unrelated pieces of work (e.g. a UI feature and an unrelated backend fix), ask the user whether they want one combined devlog or separate ones. Don't decide this yourself.

## Step 3: Gather real context, not just stats

For each selected commit:
- The commit message
- `git show --stat <hash>` for a quick file-level view
- The actual diff (`git show <hash>` or `git diff`) for real content, not just line counts, this is what lets you describe what actually happened instead of guessing from numbers
- Look at the current state of any meaningfully changed files if the diff alone doesn't give enough context

Also use:
- The user's optional note (passed as an argument, or written directly in this conversation)
- Anything already discussed in this Claude Code session that's relevant

If you genuinely don't have enough to write something true and specific (e.g. a commit message and diff are both ambiguous about intent), ask the user directly rather than guessing or inventing. Use Claude Code's interactive question capability for this instead of just asking in prose, when there's a real decision to make.

## Step 4: Write the devlog

**What makes a good Stardance devlog** (this is the actual scoring criteria, not just style advice):

- Lead with what changed, first sentence, concretely. Never open with throat-clearing like "today I worked on" or "I made some progress."
- Include real friction. Voters score storytelling higher when there's a sense of struggle and resolution, not a clean success story. If something was hard, iterated on, or took a few tries, say so, based on what the diffs and commits actually show, not invented detail.
- It's fine, even good, if the work is messy or unrelated pieces stitched together. Don't force a tidy narrative that isn't there.
- No forced significance. Don't call ordinary work a "milestone" or say it "marks a moment." Just say what happened.
- Length is flexible, and it's fine for a devlog to run long if the work genuinely calls for it. The Stardance guide suggests 3-6 sentences as a rough starting point, not a ceiling. Prioritize being complete, specific, and grounded over hitting any particular count, but don't pad or repeat yourself just to sound thorough, every sentence should earn its place.
- Suggest one visual. End with a short, concrete suggestion for what screenshot, GIF, or clip would pair well with this entry (e.g. "a screenshot of the new drag handle in the sidebar would work well here"). This is the single biggest predictor of a devlog getting attention, so don't skip it.

**Writing like a human, not an AI** (borrowed from how the humanizer skill catches AI writing patterns):

- Never use em dashes or double hyphens, in any form. Use a period, comma, or "and" instead.
- Avoid inflated or promotional words: "streamline," "showcase," "underscore," "robust," "seamless," "enhance," "leverage," "elevate," "unlock," "delve." Use plain verbs: made, fixed, changed, broke, added, moved.
- Avoid the rule of three, don't list exactly three examples or three adjectives in a row, it's a recognizable AI tic.
- Don't hedge about the user's own actions from an outside, analytical view ("it looks like," "it seems," "this suggests"). Write like the user remembers doing it, because you're synthesizing this from their actual work, not observing it as an outsider.
- Numbers as digits, not spelled out words, if you need to reference a count at all, and avoid citing raw insertion/deletion counts directly, describe what the size of a change suggests about effort instead.
- Mixed, unresolved feelings read as human. Clean, neatly wrapped-up endings read as generated. It's fine to end on "still not quite right" or similar, if that's true.
- You may only describe events that are actually present in the commit messages, diffs, or the user's note. If it's not there, don't say it, even if it sounds plausible.

## Step 5: Save the devlog

The first time this skill runs in a project, ask the user where `devlog.md` should live (suggest the repo root as a default). Remember this choice by writing it to `.devlog/config`, and check that file on future runs so you don't ask again.

Append the new entry to that file, using this markdown formatting:
- A `##` heading with the date for each entry
- **Bold** for the single most important phrase in the entry (usually the first sentence's core change)
- A short italic line at the end for the visual suggestion

Then print the same entry directly in the conversation as well, so the user can copy it to Stardance immediately without opening the file.

## Step 6: Update memory and marker

- Update `.devlog/memory.md` with a short addition summarizing what this entry covered, so future runs have this context without re-deriving it from scratch.
- Update `.devlog/marker` with the hash of the most recent commit covered.

## Notes

- Run git commands directly, don't ask permission for each one, only pause to ask the user something when you're genuinely missing information you can't get from the repo itself.
- `.devlog/` files are project-local config and memory, not something to commit to the user's actual project git history unless they ask, consider suggesting it gets added to `.gitignore` on first run.
