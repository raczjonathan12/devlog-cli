---
name: commit
description: Use when the user runs /commit, asks for help writing a commit message, or wants to commit their current changes well rather than with a generic message like "fix" or "update".
argument-hint: "[optional note on why you made this change]"
disable-model-invocation: true
---

# Commit

Help write a good commit for the user's actual current changes, based on Stardance's guide to good git commits.

One rule sits above everything else in this file. If anything below ever seems to conflict with it, it wins.

Never describe a change in the commit message that isn't actually present in the diff, and never invent a reason for a change that the user didn't state and that isn't otherwise obvious from the code itself. If the "why" isn't evident, ask rather than guess at one.

## Step 0: First-run preference check

Look for `.commits/config` at the repo root. If it doesn't exist, this is the first run in this project: ask the user how they want non-atomic changes handled going forward, either describe the suggested split and let them stage it manually, or actually run the staging commands for each group. Save their answer to `.commits/config`.

Add `.commits/` to `.gitignore` if it isn't already covered.

On later runs, read the saved preference instead of asking again. Mention once that it can be changed by editing or deleting `.commits/config`.

## Step 1: Look at the real changes

Run `git status --porcelain` and `git diff` (both staged and unstaged) to see what's actually changed. `git status --porcelain` catches new untracked files that `git diff` alone would miss.

If there's nothing to commit, say so plainly and stop.

## Step 2: Check atomicity

Look at what actually changed. If it clearly represents more than one logical unit of work, an unrelated bug fix mixed in with a new feature, two files with no shared purpose, flag it as not atomic.

If it's not atomic, handle it per the Step 0 preference:
- Describe-and-let-user-stage: present the suggested split, which files or hunks belong to which logical commit, with a draft message for each, then stop and let the user stage and re-run, or confirm to proceed with just the first group.
- Stage-automatically: run the actual staging commands for each logical group in turn, confirming with the user before each resulting commit in Step 4.

If the changes already look like one coherent unit, skip straight to Step 3.

## Step 3: Draft the message

Format: `verb subject` in imperative mood ("add", not "added" or "adding"), optionally followed by a short line on why the change was made, not a restatement of what the diff already shows.

No vague messages: "fix", "update", "changes", "wip", "asdf" don't say anything real. Say what actually changed.

Check recent `git log` for the project's own convention before deciding on a Conventional Commits prefix (`feat:`, `fix:`, etc.), it's optional and should only get added if the project already uses it.

If the why isn't evident from the diff and the user hasn't said it in conversation, ask rather than invent one, per the rule at the top of this file.

## Step 4: Ask before acting

Show the drafted message or messages and ask whether to actually run `git commit` with them. Don't commit without explicit confirmation, even if the user seems to be in a hurry, being in a hurry is exactly when a wrong commit is most likely and hardest to notice.

After a commit is made, run `git remote -v`. If a remote exists, ask whether to push now. If none exists, say so plainly and don't ask to push, don't try to create a repo or remote here, that's out of scope for this skill.

## Step 5: Self-check before showing the draft

Reread the drafted message(s) against this list before showing them:

1. Does it describe something that isn't actually in the diff?
2. Is it in imperative mood?
3. Is it vague rather than specific about what changed?
4. If there's a why line, is it actually grounded in something the user said or something evident in the code, not invented?
5. If this is one of a split set of commits, does it stand alone as a real atomic change, not an arbitrary slice?
