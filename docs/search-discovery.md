# Search discovery: state, mechanism, and what to check next

Paused 2026-08-10 with two Google Search Console validations in flight. This
file is the handoff: what was wrong, what was changed, what runs on its own
now, and what a returning reader should look at before touching anything.

## The two problems

Search Console reported two separate things that turned out to share one cause.

**Discovered, currently not indexed (5 pages, first detected 2023-09-09).**
`document-SKILLs`, `mlx-speech`, `pi-arcweld`, `presentation`, `tnt-asr`. All
five showed `Last crawled: N/A`, meaning Google knew the address existed and
had never spent a fetch on it. That is a scheduling verdict, not a quality
one: nothing linked to these pages except a sitemap, and sitemap inclusion is
discovery rather than endorsement.

**Crawled, currently not indexed (34 pages).** Almost all of them
`/mlx-atomistic/api/*`, plus `agent-designer`. These had been fetched and then
declined. Auto-generated API reference, one page per module, indistinguishable
from each other to a ranking system.

The link between them is the host. Every project page on this domain is served
from `appautomaton.renocrypt.com/<repo>/`, so all of them draw on one crawl
budget. Fifty-eight generated reference pages were absorbing the fetches the
five orphans never got.

## What changed

**mlx-atomistic stopped publishing its API reference to the index.** Each
generated module page emits `noindex, follow` from `scripts/gen_api_docs.py`,
and the sitemap filter in `site/astro.config.mjs` excludes `/api/*` while
keeping the `/api/` index itself. The sitemap went from 93 URLs to 35. The
directive is `noindex` in the HTML rather than `Disallow` in robots.txt on
purpose: a disallowed page is never fetched, so the directive is never read.

**The catalog became a join instead of a list.** `src/data/org.generated.ts`
is written by `scripts/sync-catalog.mjs` from the GitHub org API and from
probing each project address. `src/data/shelves.ts` holds the part that needs
taste: which shelf, which sentence, how wide. Nothing about a project is typed
in twice.

**The sitemap and robots.txt became build artifacts.** `scripts/prerender.mjs`
writes `dist/sitemap.xml` from the links the rendered home page actually
contains, so a URL cannot appear in one and not the other. `lastmod` comes
from each page's own `Last-Modified` header, which means it is the date that
page was built rather than a date this build invented. `dist/robots.txt`
declares the project sitemaps that the sync step found by asking. Both files
were deleted from `public/`.

**Every project page names itself and links home.** Ten spoke repositories
gained a self-referential `<link rel="canonical">`, corrected `og:url`,
JSON-LD under the same `@id` the catalog uses, and a link back to
`https://appautomaton.renocrypt.com/`. That last one is the substantive fix
for the five orphans: the catalog was voting for them and nothing was voting
back.

## What runs without anyone asking

`.github/workflows/deploy.yml` builds on every push to `main` and on a daily
cron at 05:17 UTC. A build takes about one minute. Public repositories do not
consume GitHub Actions minutes, so the schedule is free to keep.

Each build enforces three things.

**The gate.** `scripts/sync-catalog.mjs` refuses to build if any public repo in
the org is neither placed on a shelf nor listed in `notShown` with a reason.
A project cannot ship unlinked and unnoticed.

**The spoke audit.** The same script fetches every project page and reports a
missing canonical, missing title or description, a link or og tag naming the
old `appautomaton.github.io` address, or a missing link back to the catalog.
A canonical pointing at some *other* address fails the build outright, because
that removes the page from the index and is never what anyone meant. The rest
are warnings, because the markup lives in other repositories and a hub that
refuses to deploy over someone else's head tag is a hub nobody keeps.

**The sitemap check.** `scripts/prerender.mjs` asserts the rendered card count
against the catalog, then HEAD-checks every URL it just listed. A 404 or 410
fails the build; a redirect or a network error warns.

As of the pause, the audit reports zero warnings across 20 exhibits, 15 of
which publish a page.

> One trap worth knowing: a scheduled workflow on a public repository is
> disabled automatically after 60 days without repository activity. GitHub
> emails first. If this project goes quiet for two months, the daily audit
> stops and nothing announces it.

## What to check when the validations finish

Both Search Console validations were started on 2026-08-10 and take one to two
weeks. Do not start new ones while they run, and prefer not to edit the
affected pages until they report, because a change mid-run makes the result
impossible to attribute.

**Discovered, currently not indexed.** This is the real test. If the count
falls from 5 toward 0, the link graph was the constraint and the fix worked.
If `document-SKILLs` is the last one standing, the remaining problem is that
page's thinness rather than its reachability.

**Crawled, currently not indexed.** Expect the `/mlx-atomistic/api/*` pages to
leave this bucket and reappear under *Excluded by 'noindex' tag*. That is the
intended destination, not a regression. `agent-designer` will probably not
move, since nothing about it changed except its structured data and its link
home.

**If nothing moves after four weeks**, the link graph was not the constraint
and the next hypothesis should be tested rather than the same one repeated.

## Deferred, with an honest read on each

**Content depth on `agent-designer` (542 words) and `document-SKILLs`.** The
theory is that both are too thin to earn an index slot. This is a guess. Word
count is not a ranking factor, and the pages may well resolve on the link fix
alone. Worth doing only if the validation says the link fix was not enough,
which is exactly the signal the wait produces.

**A Search Console API snapshot.** The API is free. A daily pull of per-URL
index status, committed as CSV, would turn "go look at the dashboard and
squint" into a timeline. This is instrumentation rather than a fix, and the
current lack of it is why the paragraph above says "check" instead of "read".

**Audit findings as GitHub Issues.** The daily audit writes to a build log
nobody reads. Opening an issue on a finding and closing it when the finding
clears would push regressions to an inbox instead.

**Hardcoded versions.** `docker-for-apple-container` writes `v0.1.3 · updated
2026-07-16` into its footer and repeats the version and both dates in its
JSON-LD. These drift the moment a release ships.

## Manual actions taken outside this repository

Five repositories had their GitHub `homepage` field repointed from
`appautomaton.github.io` to the served address, so the link GitHub shows
beside a repo no longer redirects. The sync step warns when a homepage stops
matching, so this stays true without anyone remembering it.
