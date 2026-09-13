import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Toc from "../Toc";
import { getPost, getPosts, getHeadings, formatDate, slugify } from "../posts";

type Params = { params: Promise<{ slug: string }> };

function textOf(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(textOf).join("");
  if (children && typeof children === "object" && "props" in children) {
    return textOf((children as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return { title: post ? `${post.title} | Warren Jodjana` : "Not found" };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const headings = getHeadings(post.content);

  return (
    <article className="article">
      <header className="page-header">
        <h1>{post.title}</h1>
        <p>{formatDate(post.date)} by Warren Jodjana</p>
      </header>

      <div className="post">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, children, ...props }) => {
              void node;
              return (
                <h2 id={slugify(textOf(children))} {...props}>
                  {children}
                </h2>
              );
            },
            table: ({ node, ...props }) => {
              void node;
              return (
                <div className="table-wrap">
                  <table {...props} />
                </div>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <Toc headings={headings} />
    </article>
  );
}
