---
name: commit
description: Use when the user runs /commit, asks for help writing a commit message, or wants to commit their current changes well rather than with a generic message like "fix" or "update".
argument-hint: "[optional note on why you made this change]"
---

# Commit

Help write a good commit for the user's actual current changes, based on Stardance's guide to good git commits.

One rule outranks everything else: never describe a change that isn't actually present in the diff, and never invent a reason for a change the user didn't state and that isn't otherwise obvious from the code. If the "why" isn't evident, ask.

## Step 0: First-run preference check

Look for `.commits/config` at the repo root. If absent, first run: ask how the user wants non-atomic changes handled going forward, describe-the-split-and-let-them-stage, or stage-automatically, save the answer to `.commits/config`. Add `.commits/` to `.gitignore` if not already covered. On later runs, read the saved preference instead of asking again (mention once it can be changed by editing/deleting the file).

## Step 1: Look at the real changes

Run `git status --porcelain` and `git diff` (staged and unstaged); porcelain catches new untracked files diff alone would miss. Nothing to commit: say so and stop.

## Step 2: Check atomicity

If the changes clearly represent more than one logical unit (an unrelated fix mixed with a new feature, two files with no shared purpose), flag as not atomic and handle per the Step 0 preference:
- Describe-and-let-user-stage: present the suggested split with a draft message per group, then stop and let the user stage/re-run, or confirm proceeding with just the first group.
- Stage-automatically: run staging commands per logical group, confirming with the user before each resulting commit in Step 4.

One coherent unit already: skip to Step 3.

## Step 3: Draft the message

Format: `verb subject` in imperative mood ("add," not "added"/"adding"), optionally followed by a short why-line, not a restatement of what the diff shows. No vague messages ("fix," "update," "changes," "wip," "asdf"), say what actually changed. Check recent `git log` for the project's own convention before adding an optional Conventional Commits prefix (`feat:`, `fix:`), only if the project already uses it. If the why isn't evident and the user hasn't stated it, ask rather than invent one.

## Step 4: Ask before acting

Show the drafted message(s), ask before running `git commit`, never commit without explicit confirmation, even under stated time pressure, that's exactly when a wrong commit is likeliest and hardest to notice. After committing, run `git remote -v`, if a remote exists ask about pushing now, if none exists say so and don't ask, don't create a repo/remote here, out of scope.

## Step 5: Self-check before showing the draft

1. Describes something not actually in the diff?
2. Imperative mood?
3. Vague rather than specific?
4. If there's a why-line, is it grounded in something the user said or evident in the code, not invented?
5. If part of a split set, does it stand alone as a real atomic change, not an arbitrary slice?
