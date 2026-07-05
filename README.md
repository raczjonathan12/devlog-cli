# stardance-challenge-plugin

A Claude Code plugin built for Hack Club's Stardance challenge that writes your project's devlog entries, README, and commit messages for you, and checks that it's actually ready to ship, straight from your real git history, inside a normal Claude Code session.

*A screenshot or short recording of `/devlog` running against a real repo and producing an entry would go well here. Not captured yet.*

## Quick Start

1. `/plugin marketplace add raczjonathan12/stardance-challenge-plugin`
2. `/plugin install stardance-challenge-plugin@stardance-challenge-marketplace`
3. Run `/devlog`, `/readme`, `/commit`, or `/ship` inside any git repo you're working on in Claude Code.

There's no server to run and nothing to install outside of Claude Code itself. The plugin is just a set of skills Claude Code loads.

## Features

**`/devlog`**
- Reads your project's actual git history and writes a Stardance devlog entry from it, grounded only in real commits, diffs, and anything you've said in the conversation
- Keeps a running project memory (`.devlog/memory.md`) across runs so entries build on real prior context instead of starting fresh each time
- Tracks which commits have already been written up (`.devlog/covered.txt`), so you can pick a subset of offered commits and still come back later for the ones you skipped
- Runs a 12-item self-check on every draft before showing it to you, and rewrites anything that fails rather than showing a flawed draft first
- Writes in plain, spoken language and lets entries sound genuinely pumped or genuinely annoyed depending on how the work actually went, instead of forcing a flat, even tone

**`/readme`**
- Writes a grounded README for a project by reading its actual manifest files, folder layout, and existing docs rather than guessing at a stack
- Cross-checks any claims in existing docs (like CLAUDE.md) against the live directory listing, and flags it when a doc looks out of date
- Asks directly for anything a repo can't tell it on its own, demo links, visuals, credits, design tradeoffs, instead of inventing them
- Gives every sibling component of a multi-part project (like this plugin's individual skills) its own labeled bullet group under Features, rather than folding them all into one summary
- Runs its own pre-show self-check to catch leftover boilerplate, unverified claims, or missing components before the draft is shown

**`/commit`**
- Drafts a commit message from your actual staged and unstaged diff, in imperative mood, and refuses to describe anything not actually in the diff
- Checks whether your current changes are atomic (one logical unit) before drafting, and flags it if they look like unrelated work bundled together
- Remembers per-project (in `.commits/config`) whether you want non-atomic changes described for you to stage manually, or staged automatically group by group
- Always asks for explicit confirmation before actually running `git commit`, even if you say you're in a hurry, and offers to push afterward only if a remote exists

**`/ship`**
- Checks your GitHub repo is actually public, using `gh` if it's installed and authenticated, asking you directly if it isn't
- Confirms your README exists and isn't leftover template boilerplate
- Fetches your demo URL and reports what actually came back, while being clear that a working response isn't proof the project is playable
- Tracks the last time everything passed (`.ship/last-shipped`), so it can tell you whether you have a devlog entry since your last ship, not just whether `devlog.md` has anything in it at all
- Asks you to confirm the parts nothing in the repo can check, your Stardance description, screenshot, and Hackatime time tracking

## Local setup

Nothing to set up to use the plugin, the Quick Start above is the whole thing, no build, lint, or dependencies involved.

If you want to change how a skill behaves instead of just using it, the only "code" here is each skill's `SKILL.md` file:

1. Clone this repo.
2. Edit `skills/devlog/SKILL.md`, `skills/readme/SKILL.md`, `skills/commit/SKILL.md`, or `skills/ship/SKILL.md` directly.
3. Exercise the change by running `/devlog`, `/readme`, `/commit`, or `/ship` against a real (or throwaway) git repo in Claude Code. There's no automated test suite, so this manual run is the actual verification step.

## How it works

All four skills run as plugin skills inside a Claude Code session. There's no separate process, API call, or model call outside of Claude Code itself. `/devlog` used to be a Node/Express/OpenRouter service that made its own external model calls; that version was fully removed in favor of doing everything in-session, cutting out a server, an API key, and a whole layer of infrastructure that wasn't needed once the skill could just read the repo's git history and write directly to `devlog.md` itself.

Each skill leans on a small amount of state kept in the target project's own gitignored folders so repeated runs build on real prior context instead of re-deriving it: `/devlog` keeps a memory file and a covered-commits list in `.devlog/` so a user can selectively cover some commits now and others later without losing track of what's already been written up, `/commit` keeps a one-line preference in `.commits/` for how it should handle non-atomic changes so it only has to ask once per project, and `/ship` keeps the commit hash and timestamp of the last time everything passed in `.ship/` so it can tell whether a devlog entry actually happened since then.

## Credits

Built for [Hack Club](https://hackclub.com/)'s Stardance challenge.
