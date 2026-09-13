import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Nav from "../../components/Nav";
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
  return { title: post ? `${post.title} | warren jodjana` : "not found" };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const headings = getHeadings(post.content);

  return (
    <div className="min-h-screen bg-white text-black text-[16px] leading-none">
      <div className="max-w-[960px] mx-auto p-4 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-start mt-10 md:mt-20 ml-0 pl-0 md:pl-12">
          <Nav />

          <div className="w-full md:w-[720px] flex-shrink-0 text-black text-[16px]">
            <h1 className="text-[1.5rem] mb-3 mt-0 leading-tight font-bold">{post.title}</h1>
            <div className="flex items-center gap-2.5 mb-10">
              <span className="text-[14px] text-[#555] leading-none">{formatDate(post.date)}</span>
            </div>

            <div className="post">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, children, ...props }) => {
                    void node;
                    return (
                      <h1 id={slugify(textOf(children))} {...props}>
                        {children}
                      </h1>
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
          </div>

          <Toc headings={headings} />
        </div>
      </div>
    </div>
  );
}
