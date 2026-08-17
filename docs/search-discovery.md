# Search discovery: state, mechanism, and what to check next

Paused 2026-08-10 with two Google Search Console validations in flight, resumed
2026-08-17. This file is the handoff: what was wrong, what was changed, what
runs on its own now, and what a returning reader should look at before touching
anything.

The validations had not been read yet when work resumed, so the section on what
to check when they finish is still a question rather than a result. What the
second pass did change is the layer underneath: the host is now proxied, which
turns several things this document called impossible into ordinary edits.

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

Each build enforces four things.

**The gate.** `scripts/sync-catalog.mjs` refuses to build if any public repo in
the org is neither placed on a shelf nor listed in `notShown` with a reason.
A project cannot ship unlinked and unnoticed.

**The page question.** The gate catches a project nobody placed. The quieter
version of the same mistake is a project on a shelf that publishes no page,
because from here a page still to come and a page never wanted both read as
`hasSite: false`. A placement carrying a `noPage` reason is the whole
difference. An exhibit without one is named on every build, and so is a reason
still sitting there after its page went live, since a stale reason is worse
than none. Both are warnings rather than failures, because the page would be
built in another repository and this build cannot make that call.

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

As of 2026-08-17 the audit reports zero warnings across 21 exhibits, 16 of
which publish a page, and one open page question, `webmaton`.

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

`appcubic.com/appautomaton/` is the highest-authority page linking into this
catalog, and every one of its links named the retired `appautomaton.github.io`
address. Its structured data also claimed a different `@id` for the same
organization than the one used here, which is the kind of split that keeps a
retrieval system from resolving an entity at all. Both are corrected in that
site's own repository.

**The host is proxied as of 2026-08-17.** The origin is still GitHub Pages and
the build is unchanged, but there is an edge in front of it now. Two limits
described above stop being limits. A repository rename no longer has to mean a
permanent 404, because a redirect can be declared at the edge instead of hoping
GitHub provides one, which it does not for project pages. And a directive such
as `noindex` can be applied to a path prefix without editing the repository
that builds those pages, which was the only reason the `mlx-atomistic` fix had
to be made inside `gen_api_docs.py`.

The preconditions were read rather than assumed. The zone was already on SSL
strict, which is what keeps a proxied GitHub Pages host from looping, and three
other GitHub Pages hostnames in the same zone were already proxied the same
way, so the pattern was routine rather than an experiment.

One check is worth repeating after any change at the edge. Cloudflare can block
AI crawlers at the zone level, and a catalog that has gone invisible to GPTBot
and ClaudeBot has lost the thing this work is for. At the time of the change,
GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Googlebot,
and bingbot all answered 200 on the root, on a project page, on robots.txt, and
on llms.txt.

Enforce HTTPS was off on this repository, which is why a link to the retired
`github.io` address arrived on http and needed a second hop to reach https. It
is on now, here and on `mlx-minimax-music3`, the one project repository that
also had it off.
