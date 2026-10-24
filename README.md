# [wrjodjana.me](https://wrjodjana.me)

My personal website and blog.

## Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Content:** Markdown with [gray-matter](https://github.com/jonschlinkert/gray-matter) and [react-markdown](https://github.com/remarkjs/react-markdown)
- **Deployment:** [Vercel](https://vercel.com)

## Running locally

Requires Node.js 24.

```bash
git clone https://github.com/wrjodjana/wrjodjana.me.git
cd wrjodjana.me
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Writing a post

Add a Markdown file to `content/posts/`. The file name becomes the URL slug.

```md
---
title: Post title
date: 2026-10-24
---

# First section
```

Top-level `#` headings make the table of contents.

## Structure

```
app/
  page.tsx          # home page
  blog/             # blog index, post pages, table of contents
  components/       # sidebar
content/posts/      # blog posts in Markdown
public/             # images, videos, robots.txt
```
