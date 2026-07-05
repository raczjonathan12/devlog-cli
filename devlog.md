# Devlog

## 2026-07-05

**Added a rule letting devlogs actually sound excited or annoyed instead of staying flat and careful.**

Went through the devlog skill again and loosened it up.

Before, the tone rules kept everything even no matter how a session actually went. Now it can sound genuinely pumped if the work went well, or genuinely annoyed if it didn't, instead of forcing a flat middle voice.

Also switched the default format to short lines with blank lines between them instead of one dense paragraph, closer to how someone actually jots down what they did.

Added a bit about not listing more than three things in a row like a changelog, and about swapping in big words for plain ones when a small one says the same thing.

*A quick before-and-after of two devlog entries, same commit, one in the old paragraph style and one in the new punchy-line style, would show the difference well.*

## 2026-07-05

**Built a second skill, /readme, then had to fix it twice after it actually missed things.**

Added /readme so it writes a real README straight from the repo, checking manifests and existing docs instead of guessing.

Ran it on this project and it only wrote up /devlog. Turned out the skill was trusting an old doc that said there was just one skill, instead of looking at what was actually in the skills folder. Fixed that and had it always check the real directory listing over any doc's claim.

Then noticed the README still just mentioned /readme in passing instead of giving it a proper section. Made the rule stricter: every component found has to get its own labeled group in Features, no exceptions.

Went one more round after that. The detection was written around "skills" specifically, so it wouldn't have caught other kinds of components like agents or commands. Reworded it to catch any repeated pattern of the same kind of thing, then tested it against a fake plugin with a skill and an agent side by side, and it gave both their own sections this time.

*A before-and-after of the generated README, the version missing /readme next to the fixed one with both skills listed, would show this well.*
