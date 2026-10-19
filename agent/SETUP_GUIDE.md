# Quora Watch — agent setup guide

Import this file into an agent with browser access and list-keeping ability
to give it everything needed to run the Quora moderation workflow defined in
this repo. Read these three files into the agent's context, in this order:

1. `agent/SETUP_GUIDE.md` — this file: what the repo contains, the tools,
   the operating workflow, and the hard rules.
2. `agent/quora_watch.md` — the full classification rules and the canonical
   Red evaluation procedure. This is the assessment authority; the guide
   below summarizes it but the file itself is normative.
3. `agent/quora_guys.md` — the defined "guys": formulaic sockpuppet-troll
   archetypes. Each is a standing Red trigger.

## What this repo gives you

- `agent/quora_watch.md` — classification rules, the canonical Red
  evaluation procedure, the scan workflow, Space handling, and field notes.
- `agent/quora_guys.md` — the guy-type definitions (standing Red triggers).
- `agent/scan_settings.json` — scan tunables: block cap, wave cap, followers
  per Red, batch sizes, waits. Editable; the workflow reads it fresh.
- `red_list/profiles.txt` — red-listed profile URLs (blocked), newest first.
- `yellow_list/profiles.txt` — yellow-listed profile URLs (watch), newest first.
- `green_list/profiles.txt` — green-listed profile URLs (known good), newest first.
- `red_list/spaces.txt` — red-listed Space URLs (content farms), newest first.
- `green_list/spaces.txt` — green-listed Space URLs (verified legitimate), newest first.
- `source_list/spaces.txt` — source Space URLs (troll-hunting/alert spaces, swept for leads).
- The bookmarklet install page (https://brettlwilliams.github.io/QuoraBlockzooka/bookmarklet.html) — the six browser tools below.

## The tools

Install: drag any button on the install page to the browser's bookmarks bar,
then click it while on the relevant Quora page. Each tool is also available
as a standalone `.js` file under `blockzooka/` in the source repo.

- **block** (`blockzooka/block.js`): On a user's profile page: automate the multi-click block flow (More menu → Block → confirm).
- **blockzooka** (`blockzooka/blockzooka.js`): Paste a list of profile URLs and automate blocking all of them.
- **contributorslist** (`blockzooka/contributorslist.js`): On a Quora Space: collect the profile links of the Space's contributors.
- **extractSpaceReports** (`blockzooka/extractSpaceReports.js`): Profile scraper for Quora Space feeds: extract profile links from Space posts.
- **followerslist** (`blockzooka/followerslist.js`): On a user's profile: collect the profile links from the followers list.
- **spacemute** (`blockzooka/spacemute.js`): On a Quora Space: automate muting the Space.

## Operating workflow

1. **Collect candidates** — the home feed, notifications, and the source
   Spaces (recent posters in each).
2. **List-check BEFORE opening anything** — every candidate profile against
   the Red / Yellow / Green lists and the seen-URLs record; every Space
   against the Red and Green Space lists. Strip out everything already
   classified. Green Spaces are never swept. Green profiles are never
   re-checked.
3. **Assess only unclassified profiles** with the canonical Red evaluation
   procedure in `quora_watch.md`: identity check → content-volume triage →
   content review → edit-log review (only when the verdict is still open;
   FIRST for thin profiles) → Spaces check. Act as soon as a high-confidence
   verdict is determined; steps that can no longer change the outcome are
   skipped.
4. **Red (high confidence)** → collect the first unclassified follower URLs
   → block (verified on the page) → report to Quora only if the verdict was
   spam or sexual-abuse-material, current run only.
5. **Yellow** → watch list. **Green** → known-good list, never re-checked.
6. **Follower sweeps** — each confirmed Red triggers a sweep of its first
   unclassified followers (list-checked first, assessed individually,
   filed, then blocked) in waves, under the block cap from
   `scan_settings.json`. A guy-type match triggers a wider sweep (up to 100
   followers, assessed individually; never recurse to followers' followers).
7. **Farm Spaces** — a Space matching the farm fingerprint triggers a
   sub-scan of its admin/moderator roster plus frequent posters, then
   red-listing, muting, and blocking of Red operatives.

## Hard rules

- Red requires **high confidence** on inauthentic operation: spam, identity
  fraud, extraction, romance-bait, survey spam, thin identity + bait,
  fabricated credentials + financial bait, bot behavior, AI-slop/engagement
  farming, content-farm operation, racist content, sexual abuse material,
  Red-Space concentration, troll accounts, guy-type matches, farm Spaces,
  clear disruption, or a Quora ban (a ban is Red by itself).
- **Never Red on political viewpoint alone.** Partisan commentary backed by
  real identity signals is not Red.
- **When in doubt between Red and Yellow → Yellow.**
- **The account owner's follow is an automatic Green** — no assessment.
- **Pre-existing blocks are never touched**: record them, never unblock.
- **Guy-type match = immediate Red**, then the wider follower sweep.
- **Report-after-block**: only spam/sexual-abuse-material verdicts, only
  profiles blocked on the current run. On any Quora rate-limit, stop all
  reporting for 12 hours (block-only meanwhile).
- **Never run two browser automation sessions against Quora concurrently** —
  they share one browser profile and corrupt each other's session state.

## Defined guy types (10)

Each is a standing Red trigger — a profile matching most of a type's traits
is an immediate Red. Full definitions with all signals: `agent/quora_guys.md`.

- **Guys** (Billy Flowers archetype): a sockpuppet-troll profile matching most of these: (1) joke/provocative display name with fake, absurd employment credentials or date ranges (e.g. "...1947–present")…
- **Anti-Leftoid** (polemic-guy type): a sockpuppet-troll profile matching most of these: (1) provocative joke-style display name built around a named ideological enemy ("Anti-Islamo-Leftoid" pattern…
- **Musical Theater** (template-spam guy type): a sockpuppet-troll profile matching most of these: (1) thin, slapped-together identity — no bio or generic bio, default avatar, plain/generic display name
- **streets of** (pity-bait guy type): a sockpuppet-troll profile matching most of these: (1) thin, slapped-together identity — no bio, default avatar, plain/generic display name, brand-new account
- **Burn for eternity** (damnation-bait guy type): a sockpuppet-troll profile matching most of these: (1) thin, slapped-together identity — single-word or gibberish handle, no bio, default avatar, brand-new account
- **Former Democrat** (conversion-pitch guy type): a sockpuppet-troll profile matching most of these: (1) thin, slapped-together identity — no bio, no credentials, no education/location, brand-new account, 0–few followers
- **Proud Minority** (manufactured-minority-identity guy type): a sockpuppet-troll profile whose branding is specifically a "proud minority" identity claim — the bio presents itself as a proud Black, Asian, Hispanic…
- **Memes** (follow-bait meme-farmer guy type): a sockpuppet-troll profile matching most of these: (1) thin, slapped-together identity — generic first+last display name, non-human avatar (pet photo), near-empty bio…
- **Gender-bait** (manosphere provocation-bait guy type): a sockpuppet-troll profile matching most of these: (1) thin, slapped-together identity — nonsense or pseudonymous handle, default avatar, no credentials, no education/location…
- **Slogan-bait** (partisan-slogan bait guy type): a sockpuppet-troll profile matching most of these: (1) the display name IS an ideological slogan or tribal brand rather than a person's name…

## Rules-file map (`agent/quora_watch.md`)

- Companion files
- Workflow — check the lists BEFORE opening anything
- 🔴 Red evaluation procedure (canonical — every profile assessment follows these steps)
- 🔴 Red — block immediately
- 🟡 Yellow — watch
- 🟢 Green — known good
- 🟢 Green Spaces — never swept
- 🔍 Source Spaces — swept for leads
- Field notes

## Staying current

This guide is regenerated from the live definitions on every sync, so the
guy-type inventory and section map above always reflect the current
`quora_watch.md` and `quora_guys.md`. The definitions themselves are the
source of truth — when they change, this file follows automatically. The
static prose (workflow, hard rules, tool purposes) is reviewed whenever the
underlying rules change.
