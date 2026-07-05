---
name: ship
description: Use when the user runs /ship, asks if their project is ready to ship or submit on Stardance, or wants a readiness check before submitting.
argument-hint: "[optional demo URL]"
disable-model-invocation: true
---

# Ship

Check a project against Stardance's actual shipping requirements before the user submits, so gaps get caught here instead of causing a rejection.

One rule outranks everything else: never report a check as passing without actually verifying it (a file read, a `gh` command, a real fetch, or explicit user confirmation for what nothing local can verify). A check that wasn't actually checked doesn't get a pass.

## Step 0: Find the repo root

Run `git rev-parse --show-toplevel`. Not a git repository: say so and stop, nothing to ship without one.

## Step 1: Check 1, public GitHub repo

Run `git remote -v`, no remote at all fails immediately ("no GitHub remote configured"). If a remote exists, try `gh repo view --json visibility -q .visibility`, use the real answer if it succeeds. If `gh` isn't installed, isn't authenticated, or the command fails for any reason, that's not a failure of the check itself, ask the user directly whether the repo is public.

## Step 2: Check 2, README

Read `README.md` at the repo root, fails if absent. Flag as incomplete (not a clean pass) if it's leftover template boilerplate or placeholder text, same judgment `/readme`'s self-check already makes, don't invent new detection logic. Missing or incomplete: point to `/readme` as the fix, don't draft one here.

## Step 3: Check 3, live demo URL

Ask for the demo URL if not passed as an argument. "There isn't one yet" is a fail, not a skip, Stardance requires a working demo. Fetch it and report what actually came back (real response, 404, timeout, whatever happened), stating plainly that a working response only means the URL loads, not that the project is playable, that judgment stays with the user.

## Step 4: Check 4, project completeness and devlog since last ship

Look for `.ship/last-shipped` (commit hash on line 1, a full UTC timestamp in `YYYY-MM-DDTHH:MM:SSZ` form on line 2, from the last time this skill confirmed everything passed). Absent: never fully shipped through this skill before, any existing `devlog.md` entry counts.

Present: compare `devlog.md`'s own last-modified time against the recorded timestamp, not the `## YYYY-MM-DD` heading dates. `devlog.md` is gitignored by design (see `/devlog`), so its commit history isn't reliable, and heading dates alone can't distinguish two ships that happen on the same day. Get the file's real mtime (e.g. `stat` or equivalent for the OS in use) and compare it directly against the recorded timestamp. Older or equal: fails, point to `/devlog`.

Separately, ask the user to confirm a description and screenshot exist on the Stardance platform itself, neither lives in the repo.

## Step 5: Check 5, time tracking

Ask the user to confirm Hackatime is connected and logging for this project, nothing local to check this against, always a direct question.

## Step 6: Self-check before showing the report

1. Did every "passing" check actually get verified (file read, `gh` call, real fetch, or explicit confirmation), not assumed?
2. Does the demo-URL result state that a working response isn't proof of playability?
3. Does every failing check point to a concrete next step?

## Step 7: Show the report and update state

Print a checklist (pass / fail / needs the user's own confirmation) with reason and fix for anything not a clean pass, ending in a clear verdict (ready to ship, or not yet with a count of what's left).

If everything passed, write `.ship/last-shipped` as two lines, the current commit hash (`git rev-parse HEAD`) then a full UTC timestamp in `YYYY-MM-DDTHH:MM:SSZ` form (e.g. `date -u +%Y-%m-%dT%H:%M:%SZ`), not a bare date, so Step 4's mtime comparison on a future run is unambiguous. A partial run doesn't write this file, it shouldn't reset the baseline.

The first time you're about to actually write `.ship/last-shipped`, add `.ship/` to `.gitignore` first if not already covered, same as `.devlog/` and `.commits/`.
