# Devlog

## 2026-07-03

**Spent the day building out a devlog skill for Claude Code and kept finding new ways it could go wrong.** Started by dropping the CLI-and-backend plan and turning this into a plugin instead, a plugin.json plus a first SKILL.md that has Claude read your git history and write the entry right there, no server needed. A few hours later I went back through it and added a bunch of edge cases I hadn't thought about the first time, things like a huge diff, a binary file, a commit from someone else, work sitting uncommitted, a diff with something that looks like a secret in it, that kind of thing. I also added a self-check pass so the draft gets reread against a short list of AI-writing tics before it's shown to anyone.

Then near the end of the day I caught something in my own rules. The skill was telling itself to sound honest and grounded, but it had no rule against describing a design decision as if it were a bug that actually happened, which is exactly the kind of thing this tool is supposed to catch. I added that as a third rule sitting above everything else in the file, next to the no-inventing-details rule, and cleaned up a duplicate rule while I was in there. I also pulled an old demo devlog.md entry that had been sitting in the repo from testing.

Right now I'm still in the middle of another pass, adding a rule about writing in plain, everyday language instead of anything that sounds like an essay or a spec, and one about calling out jargon words like "guardrail" or "architecture" that only make sense with full context. Not committed yet, still checking whether the wording actually reads like something a person would say.

*A side-by-side of the SKILL.md before and after today's changes, or a screenshot of a devlog entry it actually produced, would show what all this editing was for.*
