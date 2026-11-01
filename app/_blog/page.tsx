import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, formatDate } from "./posts";

export const metadata: Metadata = {
  title: "Blog | Warren Jodjana",
  description: "Things I've written.",
};

export default function Blog() {
  const posts = getPosts();

  return (
    <>
      <header className="page-header">
        <h1>Blog</h1>
        <p>Notes on agents, dev tools, and building.</p>
      </header>

      {posts.length === 0 ? (
        <p>Nothing here yet.</p>
      ) : (
        <ul className="essay-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <small>{formatDate(post.date)}</small>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
