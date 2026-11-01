# [wrjodjana.me](https://wrjodjana.me)

My personal website.

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

The blog is hidden from the site for now. Its code lives in `app/_blog/`, and the `_` prefix keeps it out of routing. To bring it back, rename the folder to `app/blog/` and add the Blog link back to the sidebar.

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
  _blog/            # hidden blog: index, post pages, table of contents
  components/       # sidebar
content/posts/      # blog posts in Markdown
public/             # images, videos, robots.txt
```
