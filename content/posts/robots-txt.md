---
title: Writing robots.txt for the agentic era.
date: 2026-10-01
---

# How can agents access and understand your websites?

There are two files that are most important for Agentic SEO: `robots.txt` and `llms.txt`. `robots.txt` gives agents **access** to your website while `llms.txt` gives agents **context** to your website. This blog will discuss the former.

# What is robots.txt?

`robots.txt` is a plain text file that lives at the root of your site, for example `https://example.com/robots.txt`. Before a crawler visits any page, it fetches this file first to check which pages it is allowed to visit.

The idea is not new. Site owners have used `robots.txt` since the 1990s to keep badly behaved crawlers away, and it is now almost everywhere: the [2025 Web Almanac](https://almanac.httparchive.org/en/2025/security) reports that 81% of desktop sites and 80% of mobile sites host one. In 2019, Google pushed to formalize it by open-sourcing its own `robots.txt` parser and proposing it as a proper internet standard, which became [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309) in 2022.

So what goes inside the file? It is split into **groups**. Each group starts with one or more `User-agent` lines that name the crawlers it applies to, followed by `Allow` and `Disallow` rules for paths on your site.

**Example:**

```txt
User-agent: *
Disallow: /admin/

User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /

User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
Allow: /
Disallow: /admin/

Sitemap: https://example.com/sitemap.xml
```

Reading it group by group:

- Every other crawler can visit the whole site except `/admin/`.
- `GPTBot` and `ClaudeBot`, which OpenAI and Anthropic use to collect training data, cannot visit anything.
- `OAI-SearchBot` and `Claude-SearchBot`, which OpenAI and Anthropic use to show your pages in search results, can visit everything except `/admin/`.
- Sitemap tells crawlers where to find a list of all your pages.

# Which bots should you let in?

As mentioned above, there are different kinds of bots, and each one visits your site for a different reason. AI companies usually split their bots into three kinds:

| Kind     | What it does                                                   | Examples                                             | Let it in?  |
| -------- | -------------------------------------------------------------- | ---------------------------------------------------- | ----------- |
| Search   | Indexes your pages so they can show up as answers in AI search | `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot` | Yes         |
| User     | Fetches a page right now because a user asked an agent to      | `ChatGPT-User`, `Claude-User`, `Perplexity-User`     | Yes         |
| Training | Collects pages to train future AI models                       | `GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`    | Your choice |

**Search bots** are the most important ones for Agentic SEO. If they cannot crawl your site, you will not show up when someone asks ChatGPT, Claude or Perplexity a question that your site answers.

**User bots** matter just as much. When a user pastes your link or asks an agent to look something up, the agent sends one of these bots to read your page on the spot. Blocking them means the agent comes back empty-handed.

**Training bots** are the only real choice. Letting them in means your content can shape what future models know, but you get no link or credit back. Blocking them has no effect on whether you show up in AI search today, which is why my own site blocks them.

Note that `Google-Extended` is not a crawler. It is only a token that tells Google not to use your pages to train Gemini, and `Googlebot` still crawls your site as usual.

P.S. **`Googlebot`, `Bingbot` and `Applebot`** are regular search engine crawlers, and generally you should not add any rules for them. They power Google Search, Bing and Siri/Spotlight respectively, so blocking them would cost you far more traffic than any AI bot ever could.

# Where robots.txt actually lives

Crawlers always see one plain file at `/robots.txt`, but where that file comes from depends on how your site is built:

1. A **static** file in a folder like `public/` or `static/` that ships as is, which is common in Docusaurus, Astro, Hugo and plain HTML sites.
2. Code that **generates** the file, like `app/robots.ts` in Next.js, where you return the rules as an object instead of writing text.
3. A platform like WordPress, Webflow or Wix that builds the file for you, so you edit it in a settings page instead of your code.

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", disallow: "/admin/" },
      { userAgent: ["GPTBot", "ClaudeBot"], disallow: "/" },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

# Common mistakes

On the surface, writing a `robots.txt` seems extremely simple, but there are really specific nuances you have to take into consideration:

1. A bot with its own group ignores `User-agent: *` completely, which is why the example above repeats `Disallow: /admin/` for the search bots.
2. The **longest** matching rule wins rather than the first one, so `Allow: /docs/public/` beats `Disallow: /docs/` no matter which order you write them in. If two rules match with the same length, `Allow` wins. Some older crawlers still use the first match, so do not rely on order either way.
3. A `User-agent` line with no rules joins the group below it, so if you delete a bot's rules but forget its `User-agent` line, that bot quietly picks up the next bot's rules.
4. It is a **request** rather than a wall, and since some user bots like `ChatGPT-User` may ignore it, you should use your firewall or CDN if you really need to block a bot.
5. The HTTP status of the file itself matters, because a 404 tells crawlers they can crawl everything while a 500 tells them to crawl nothing.
6. Each subdomain needs its own file, so `https://example.com/robots.txt` has no effect on `https://docs.example.com`.
7. `Disallow` stops crawling, not indexing. A blocked page can still show up in results if other sites link to it, so use a `noindex` tag if you want it gone.

# agentic-seo-gen

After going through all of the issues above, I realized that most people will not want to look up every AI bot name and remember which group it belongs to. So I built [agentic-seo-gen](https://github.com/wrjodjana/agentic-seo-gen), a Claude Code plugin that writes the AI bot part of your `robots.txt` for you.

**Install:**

```txt
/plugin marketplace add wrjodjana/agentic-seo-gen
/plugin install agentic-seo-gen@agentic-seo-gen
```

Then run this in the repo of your website, or in an empty folder if you only have the live site:

```txt
/agentic-seo-gen:setup
```

![Running /agentic-seo-gen:setup on a demo site](/videos/agentic-seo-gen-setup.mp4)

Running the setup on a demo site.

The setup asks you **3 yes/no questions**, one for each kind of bot from the table above: AI search, AI agents and AI training. After that, it asks which paths to hide and if you want to block or allow any vendor completely. Before it writes anything, it shows you a preview of the file and a table of what each AI vendor can reach.

Depending on how your site is built, the plugin gets the file to your site in a different way:

| Your site                                      | What setup does                                                 |
| ---------------------------------------------- | --------------------------------------------------------------- |
| Static file in the repo (e.g. HTML)            | Writes the block into that file                                 |
| Code that generates /robots.txt (e.g. Next.js) | Changes the generator with you                                  |
| Platform or no repo (e.g. WordPress)           | Builds the full file from the live /robots.txt for you to paste |

A few things I made sure of while building it, because of the mistakes listed above:

1. It **only changes its own block**, which sits between `# BEGIN aeo` and `# END aeo`, so any rules you wrote by hand stay the same.
2. It **never touches** `Googlebot`, `Bingbot` or `Applebot`, since blocking them would remove the search traffic going into your website.
3. Every bot gets the same hidden paths in its own group, so no bot quietly loses the rules from `User-agent: *`.
4. Your answers are saved inside the block itself, so when you run the setup again, it starts from what you picked last time.

After you deploy, you can check that the live file matches what you set up:

```txt
/agentic-seo-gen:setup verify
```

This is the exact setup that made the [`robots.txt`](/robots.txt) on my own site, which lets search and user bots in and blocks training bots.
