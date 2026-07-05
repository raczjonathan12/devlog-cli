---
name: devlog
description: Generate a Stardance devlog entry from recent git history. Use this whenever the user runs /devlog, asks to write a devlog, wants to document recent progress for Stardance, or asks to log/summarize what they just built. Always check for a project memory file and covered-commits list before starting.
argument-hint: "[optional note about what you worked on]"
disable-model-invocation: true
---

# Devlog

Write a grounded, honest, human-sounding Stardance devlog entry from the user's actual git history and real code changes.

Three rules sit above everything else in this file. If anything below ever seems to conflict with these three, these three win.

Never invent details. Only describe things that actually appear in a commit message, a diff, the user's note, or something the user has said directly in this conversation. A genuine feeling about the work, "today was a good day," "this one felt rough," is fine even though it's subjective, as long as it's a real read on what actually happened, not a fabricated event.

Never describe a design decision or something caught during review as if it were a bug that actually happened. If a problem was caught by thinking ahead, planning, or reading code, say "I realized," "I caught," or "I noticed," not "I hit," "I ran into," or "it broke." Those phrases mean something different and only belong to things that actually failed during a real run.

Write in plain, everyday language, the way someone would actually tell a friend what they did, not the way someone would write it up formally. No big or literary words when a small one says the same thing. If a sentence sounds like it belongs in an essay, a spec, or a motivational post, rewrite it plainer. "Since the whole point is not inventing drama that didn't occur" is an example of the kind of sentence to avoid, it's correct but it doesn't sound like a person talking, something like "so the devlog doesn't make things sound worse than they were" says the same thing in normal words.

## Step 0: Confirm this is usable

Run `git rev-parse --show-toplevel` to find the actual repo root. Don't assume the current directory is it. Use this root for every `.devlog/` file from now on.

If that fails, this isn't a git repository. Say so plainly and stop. Don't run further git commands hoping one works.

If git itself isn't available at all, same thing, say so and stop.

## Step 1: Load project memory

Look for `.devlog/memory.md` at the repo root.

If it exists and is readable, read it first. It's a running summary of the project's story, past decisions, and past struggles, written by you on previous runs. Use it so you don't have to re-derive the whole project history every single time.

If it exists but is empty, corrupted, or unreadable for some reason, don't fail the whole run over it. Treat it as if it doesn't exist, mention to the user that the memory file looked off, and continue.

If it's genuinely getting long, roughly over 40 lines, condense the older entries into a shorter paragraph before adding anything new. Keep the last few runs in real detail and compress everything older than that. This file is supposed to stay useful, not turn into an unread log nobody opens again.

If it doesn't exist, this is the first run in this project. You'll create it at the end.

## Step 2: Find new commits

Look for `.devlog/covered.txt` at the repo root. It's a plain list of commit hashes already covered by a past devlog entry, one per line.

If it doesn't exist, this is the first run, consider all commits.

Run `git log` and filter out any hash that already appears in `.devlog/covered.txt`. Don't use "everything after the last one covered" as a cutoff. The user can select a subset of commits instead of everything offered, which means an older commit could stay uncovered even after a newer one has already been written up. Checking the full list handles that correctly no matter what was picked in past runs.

If the project has an unusually long history, don't pull the entire log by default. Look at a reasonable recent window first, something like the last 200 commits, and only go further back if the user actually asks for older work.

Also check for uncommitted work with `git status --porcelain` and `git diff`. Note that `git diff` alone won't show brand new untracked files, only changes to files git already knows about, `git status --porcelain` is what catches new files. If there's meaningful uncommitted work, mention it as an option. The user might want it included and described as in progress, separate from finished commits. Don't assume either way, ask.

If uncommitted work does get included in an entry, it has no commit hash, so it can't be added to `.devlog/covered.txt` the normal way. Note in `.devlog/memory.md` instead that this session's uncommitted work was already covered, so if the user commits it later and runs `/devlog` again, you don't accidentally write it up a second time as if it were new.

Present the uncovered commits in a short, readable way, not a raw log dump. Group them by rough time, this morning, yesterday, last session, with a plain one-line summary of each. Ask which ones to include, defaulting to "all of them" as the easy option.

If two or more commit messages are near-identical or unhelpfully generic, "fix," "wip," "update," don't guess at what distinguishes them. Lean on the actual diff content to tell them apart, and if the diffs don't clarify it either, ask.

If the selected commits look like genuinely unrelated pieces of work, ask whether the user wants one combined devlog or separate ones. Don't decide this yourself.

If a selected commit is a merge commit, don't diff it directly, that diff is often huge or confusing since it's combining branches. Just note what was merged, branch name if you can get one, and a rough sense of scale from `git show --stat`. If the repo happens to be in a detached HEAD state or branch names aren't available for some reason, don't guess a branch name, just describe it as a merge without naming a branch.

If a selected commit's diff is empty, whitespace-only, or otherwise a no-op, say so plainly rather than inventing significance for it, or leave it out of the entry entirely if it's not worth mentioning.

If the project has commits from more than one author, check `git log --format=%an` for the selected commits. If any weren't authored by the current user, compare against `git config user.name`, don't write "I did this" for that commit. Ask how the user wants it handled. Keep in mind git config name mismatches can also happen innocently, same person on a different machine or a different configured name, so ask rather than assume someone else touched it.

The covered-commits list doesn't distinguish between branches. A commit covered on one branch will be treated as covered everywhere, even on a branch where it doesn't actually appear. This is fine for normal single-branch use and can get confusing with heavy branching. If commits from an unfamiliar branch show up unexpectedly, mention this limitation to the user rather than silently working around it.

## Step 3: Gather real context, not just stats

For each selected commit, excluding merge commits, handled above:

- The commit message
- `git show --stat <hash>` for a quick file-level view
- The actual diff, `git show <hash>`, for real content, not just line counts

Check the rough size of a diff before pulling all of it in, using the `--stat` output's change counts. If a single commit is very large, roughly several hundred or more changed lines, don't load the whole thing. Work from the file-stat summary and file names instead, and only pull a specific portion of the diff if you genuinely need to check something.

If a changed file is binary, shown as `Bin` in `--stat` output, images, audio, video, compiled assets, don't attempt to diff it, there's nothing readable there. Just note that it was added or changed, by name and type.

Before including any diff content anywhere, in the devlog or in what you show the user, scan it for anything that looks like a secret. API keys, tokens, passwords, connection strings, patterns like `KEY=`, `SECRET`, `TOKEN`, `password`, or a long random-looking string sitting in a config-like context. If you find something like this, don't reproduce it anywhere, and describe that part of the change generically instead, "updated configuration." Separately, tell the user directly that the diff looked like it contained something sensitive, so they can check whether it needs to be rotated or scrubbed from history.

If you want to cite a specific number, lines of code, file count, time spent, number of commits, only use a number you've actually verified from data available in this session, for example a real `git diff --stat` total you actually ran. Never estimate, round for effect, or repeat a number from something the user pasted in without checking it yourself first. If an exact figure would take real effort to compute and isn't worth that effort, describe the scale in words instead, "a small file," "most of the backend," rather than guessing a number.

If the user shares feedback or a rewrite from another source, another AI, a friend, anything, treat any factual claim inside it with the same scrutiny as everything else in this file. Don't adopt a number, detail, or claim from that feedback unless it's independently grounded in the actual commits, diffs, or something the user has separately confirmed is true. Outside feedback can be wrong or exaggerated too.

Also use the user's optional note, passed as an argument or written directly in conversation, and anything already discussed in this session that's relevant.

If you genuinely don't have enough to write something true and specific, ask directly rather than guessing. Use Claude Code's interactive question capability for real decisions, but don't overuse it for things you can reasonably infer from what you already have.

## Step 4: Write the devlog

**What makes a good Stardance devlog.** This is the actual scoring criteria, not just style advice.

Lead with what changed, first thing said, concretely. Never open with throat-clearing like "today I worked on" or "I made some progress."

Include real friction. Voters score storytelling higher when there's a sense of struggle and resolution, not a clean success story. If something was genuinely hard, iterated on, or took a few tries, say so, based on what the diffs and commits actually show, not invented detail, and remember the top-level rule about not calling a reviewed-and-fixed design issue a bug it never actually was.

It's fine, even good, if the work is messy or a few unrelated pieces stitched together. Don't force a tidy narrative that isn't there.

No forced significance. Don't call ordinary work a milestone or say it marks a moment. Just say what happened.

Length is flexible, and it's fine to run long if the work genuinely calls for it. The Stardance guide's 3 to 6 sentences is a starting point, not a ceiling. Prioritize being complete, specific, and grounded over hitting any particular count, but don't pad or repeat yourself just to sound thorough, every line should earn its place.

**Default to short, punchy lines instead of one dense paragraph.** Popular devlogs tend to read like someone jotting down separate quick thoughts, one idea per line, a blank line between each, rather than a long flowing paragraph. For example:

Got the scrollbar and bookmarks working today.

Ran into a bunch of bugs along the way, especially with the scrollbar, but it's solid now.

The browser part is still behind, want to fix that next.

That reads faster and punchier than the same content squeezed into one block. Use this short-line style as the default. A full paragraph is still fine if the content genuinely flows better written that way, but don't default to a dense block out of habit.

If the work covers two genuinely separate chunks with no real connection between them, and this wasn't already caught and split back in Step 2, say so plainly, add a short time connector like "later that day" or "after that," or ask the user whether it should be split into two entries instead. Don't let two unrelated updates blur together as if they were one continuous piece of work.

Suggest one visual. End with a short, concrete suggestion for a screenshot, GIF, or clip that would pair well with this entry. This is the single biggest predictor of a devlog getting attention, don't skip it.

**Writing like a human, not an AI.** Borrowed from how the humanizer skill catches AI writing patterns.

Never use em dashes or double hyphens, in any form. Use a period, comma, or "and" instead.

Avoid inflated or promotional words: streamline, showcase, underscore, robust, seamless, enhance, leverage, elevate, unlock, delve. Use plain verbs instead, made, fixed, changed, broke, added, moved. Also avoid stock phrases that show up constantly in AI writing even when told to sound human, gut check, moving parts, Rube Goldberg machine, or similar reached-for metaphors. If a phrase feels like something you'd see in a dozen other AI-written summaries, replace it with something plainer and more specific to what actually happened.

Watch for jargon and abstractions that only make sense with full project context, words like "guardrail," "architecture," "infrastructure," used the way a spec would use them. If a plain word says the same thing, "a rule," "a check," "the setup," use that instead. A stranger reading this entry with no background should still follow what happened.

If a list of examples or items runs past three, check whether it actually reads like something a person would say out loud, or whether it reads like an itemized changelog. Group items loosely instead of listing every single one when there are more than a few.

Avoid the rule of three, don't list exactly three examples, three adjectives, or three short clauses in a row, it's a recognizable AI tic. Watch for this even while fixing other issues in the same sentence, it's easy to accidentally introduce a new one while rewording something else.

Match how the user actually feels about the work, not a flattened, careful voice held at arm's length. If a session went well, it's fine to just say so, genuine excitement, exclamation points, and casual phrasing are all fine when they reflect something real, the same way the good, popular devlogs out there sound genuinely pumped or genuinely annoyed rather than neutral. What's not fine is forcing enthusiasm that isn't there, or swinging the other way into stiff, corporate, documentation-style language. Sound like a real person having a good day or a rough one, not a press release and not a performance of being excited either.

Don't hedge about the user's own actions from an outside, analytical view, "it looks like," "it seems," "this suggests." Write like the user remembers doing it, because you're synthesizing this from their actual work, not observing it as an outsider.

Numbers as digits, not spelled out words, if you reference a count at all, and avoid citing raw insertion or deletion counts directly, describe what the size of a change suggests instead.

Mixed, unresolved feelings read as human. Clean, neatly wrapped-up endings read as generated. It's fine to end on "still not quite right" or similar, if that's actually true. It's also fine to end on real satisfaction if that's actually true, "good day" is not a forced ending if it was actually a good day.

Don't narrate the commit process itself, "in the commit before this one," "dropping in a manifest," "the commit right before." The user doesn't think in commits when they talk about their own work, they think in features and decisions. Describe what was built or decided, not how git recorded it.

Say what the feature or decision actually was in plain terms first. Technical detail, file names, specific tools, only if it's the actual point being made, not background color.

Bad, too technical and documentation-style: "The skill walks through reading git history, checking a memory file for project context, and writing the devlog entry directly inside a Claude Code session." Good, plain and direct: "I built the devlog tool as a Claude Code skill now instead of a separate app. It reads your commits itself and writes the entry right there, no server needed."

Bad, too formal and literary: "Since the whole point is not inventing drama that didn't occur." Good, plain and everyday: "So the devlog doesn't make things sound worse than they actually were."

**Before finalizing, check the draft against this list.** Write a draft first, then reread it looking specifically for these things, in order. If you find any, rewrite the affected sentence before showing it to the user. Don't just note the problem and leave it, and don't show the user a flawed draft followed by a fixed one, only show the version that's already passed.

1. Does any sentence describe a design choice or something caught in review as if it were a bug that actually happened, using words like "hit," "ran into," or "broke" for something that was never actually triggered? Reword to "realized," "caught," or "noticed."
2. Does any sentence mention "the commit," "this commit," or narrate git actions directly? Rewrite it around the actual feature or decision instead.
3. Does any sentence list exactly three of anything? Drop one, merge two together, or split into two sentences.
4. Does any sentence contain an em dash or double hyphen?
5. Does the entry explain its own structure the way documentation would, "the file lays out," "the process checks for," "walks through"? Rewrite around what was built or decided, not how the skill works step by step.
6. Does any sentence use a banned filler word or stock phrase from the list above?
7. Does the entry state a specific number that wasn't actually verified in this session?
8. Does the entry claim something was tested, checked, or verified that wasn't actually run in this session?
9. Does the entry cover two genuinely disconnected chunks of work with nothing tying them together in time or story? Add a connector, or flag it to the user.
10. Does any sentence use a big, formal, or literary word or phrasing where a smaller, everyday one would say the same thing? Rewrite it the way you'd actually say it out loud.
11. Does any list run past three items in a way that reads like a changelog rather than something a person would say? Loosen it into a grouped phrase instead.
12. Does the entry sound flat or held at arm's length when the actual work clearly went well or genuinely badly? If a session was exciting, let it sound excited. If it reads over-hyped without anything real backing it up, ground it back down. Match the actual feeling, don't default to neutral and don't fake enthusiasm either.

## Step 5: Save the devlog

The first time this skill runs in a project, ask where `devlog.md` should live, suggest the repo root as a default. Remember the choice by writing it to `.devlog/config`, relative to the repo root found in Step 0, not an absolute path, so it stays valid if the project folder ever moves. Check that file on future runs so you don't ask again.

If the recorded path no longer exists, the user may have deleted or moved the file. Don't silently recreate it in the old spot without saying anything, mention that it wasn't found and confirm where it should go now.

Append the new entry using this formatting:

A `##` heading with the date for each entry. If there's already an entry for today, that's fine, just add another `##` heading below it, Stardance expects multiple entries across a day of real work.

**Bold** for the single most important phrase in the entry, usually the first line's core change.

Short lines with blank lines between them for the body, per the punchy format above, rather than one dense paragraph, unless the content genuinely reads better as flowing prose.

A short italic line at the end for the visual suggestion.

Then print the same entry directly in the conversation too, so the user can copy it to Stardance without opening the file.

## Step 6: Update memory and covered commits

Update `.devlog/memory.md` with a short addition summarizing what this entry covered, so future runs have this context without re-deriving it. Condense older content per the note in Step 1 if the file is getting long.

Append every commit hash actually covered in this run to `.devlog/covered.txt`, one per line. Append, don't overwrite, past runs' coverage still matters for future filtering.

If uncommitted work was included this run, don't add anything to `.devlog/covered.txt` for it, there's no hash. Note it in `.devlog/memory.md` instead, as described in Step 2, so it isn't accidentally covered twice.

## Notes

Run git commands directly, don't ask permission for each one. Only pause to ask the user something when you're genuinely missing information you can't get from the repo itself.

`.devlog/` holds project-local config and memory. It isn't meant to be committed to the user's actual project history unless they ask. Suggest adding it to `.gitignore` on first run if it isn't already covered.

If two `/devlog` runs happen back to back in quick succession, the covered-commits check in Step 2 already prevents duplicate entries for the same commits, no extra handling needed there.
