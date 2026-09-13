import type { Metadata } from "next";
import Link from "next/link";
import Nav from "../components/Nav";
import { getPosts, formatDate } from "./posts";

export const metadata: Metadata = {
  title: "blog | warren jodjana",
  description: "things i've written",
};

export default function Blog() {
  const posts = getPosts();

  return (
    <div className="min-h-screen bg-white text-black text-[16px] leading-none">
      <div className="max-w-[960px] mx-auto p-4 md:p-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-start mt-10 md:mt-20 ml-0 pl-0 md:pl-12">
          <Nav />

          <div className="w-full md:w-[720px] flex-shrink-0 text-black text-[16px]">
            <h1 className="text-[1.5rem] mb-6 mt-0 leading-none font-bold">blog</h1>

            {posts.length === 0 ? (
              <p className="leading-none">nothing here yet.</p>
            ) : (
              <ul className="list-none p-0 m-0">
                {posts.map((post) => (
                  <li key={post.slug} className="mb-7">
                    <Link href={`/blog/${post.slug}`} className="underline text-[#0000ee] leading-snug">
                      {post.title}
                    </Link>
                    <div className="flex items-center gap-2.5 mt-2 text-[14px] text-[#555] leading-none">
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
