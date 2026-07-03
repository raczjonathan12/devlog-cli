# Devlog

## 2026-07-03

**Built the devlog tool as a Claude Code skill instead of a separate CLI and backend.** Added a plugin.json to register it as a Stardance challenge plugin, and wrote the actual devlog skill, which has Claude read your git history and write the entry right in the same session, no server needed. The earlier setup had a CLI hitting a backend over HTTP to generate the writeup, and this replaces all of that with one file. Still not sure the skill format holds up once it's run more than once on a real project, this is the first time it's actually being used.

*A screenshot of this exact conversation, running /devlog and getting asked which commits to include, would show it working end to end.*
