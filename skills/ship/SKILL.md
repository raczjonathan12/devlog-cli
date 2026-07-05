---
name: ship
description: Use when the user runs /ship, asks if their project is ready to ship or submit on Stardance, or wants a readiness check before submitting.
argument-hint: "[optional demo URL]"
disable-model-invocation: true
---

# Ship

Check a project against Stardance's actual shipping requirements before the user submits, so gaps get caught here instead of causing a rejection.

One rule sits above everything else in this file. If anything below ever seems to conflict with it, it wins.

Never report a check as passing without actually verifying it, a file read, a `gh` command, a real fetch, or explicit user confirmation for the parts nothing local can verify. A check that wasn't actually checked doesn't get a pass.

## Step 0: Find the repo root

Run `git rev-parse --show-toplevel`. If this isn't a git repository, say so plainly and stop, there's nothing to ship without one.

## Step 1: Check 1, public GitHub repo

Run `git remote -v`. If there's no remote at all, this check fails immediately, say "no GitHub remote configured."

If a remote exists, try `gh repo view --json visibility -q .visibility`. If that succeeds, use the real answer.

If `gh` isn't installed, isn't authenticated, or the command otherwise fails, don't treat that as a failure of the check itself, ask the user directly whether the repo is public.

## Step 2: Check 2, README

Read `README.md` at the repo root. Fails if it doesn't exist.

Also flag it as incomplete rather than a clean pass if it's leftover template boilerplate or placeholder text, same judgment call the `/readme` skill's self-check already makes, don't invent new detection logic for this, just apply that same read.

If it's missing or incomplete, point to `/readme` as the fix, don't draft one here.

## Step 3: Check 3, live demo URL

Ask the user for the demo URL if one wasn't passed as an argument. If they say there isn't one yet, that's a fail, not something to skip, Stardance requires a working demo, not a placeholder.

Fetch the URL and report what actually came back, a real response, a 404, a timeout, whatever happened. State plainly that a working response only means the URL loads, not that the project is actually playable, that judgment still belongs to the user.

## Step 4: Check 4, project completeness and devlog since last ship

Look for `.ship/last-shipped` at the repo root. It's a small file with a commit hash and a timestamp from the last time this skill confirmed everything passed.

If it doesn't exist, this project has never fully shipped through this skill before, any existing entry in `devlog.md` counts toward this check.

If it does exist, check `devlog.md` for a `##` dated entry newer than the recorded timestamp, using the same `## YYYY-MM-DD` heading format `/devlog` already writes. No qualifying entry means this check fails, point to `/devlog` as the fix.

Separately, ask the user to confirm their project has a description and a screenshot set up on the Stardance platform itself, neither of those lives in the repo so nothing here can check them directly.

## Step 5: Check 5, time tracking

Ask the user to confirm Hackatime is connected and actually logging time for this project. There's nothing in the repo to check this against, so this is always a direct question, not an inference.

## Step 6: Self-check before showing the report

Before printing anything, reread what you're about to report:

1. Did every check marked as passing actually get verified, a file read, a `gh` call, a real fetch, or explicit user confirmation, not assumed?
2. Does the demo-URL result actually state that a working response isn't proof of playability?
3. Does every failing check point to a concrete next step, not just "this failed"?

## Step 7: Show the report and update state

Print a checklist, one line per check, pass, fail, or needs the user's own confirmation, with the reason and the fix for anything that isn't a clean pass. End with a clear overall verdict, ready to ship, or not yet with a count of what's left.

If every check passed, write `.ship/last-shipped` at the repo root with the current commit hash (`git rev-parse HEAD`) and the current timestamp, so the next run has a real baseline for the devlog-since-last-ship check. If the run didn't fully pass, don't write this file, a partial run shouldn't reset the baseline.

The first time you're about to actually write `.ship/last-shipped`, before writing it, add `.ship/` to `.gitignore` if it isn't already covered, the same way `.devlog/` and `.commits/` already are.
