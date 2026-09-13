"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { id: "about", href: "/#about", label: "About" },
  { id: "blog", href: "/blog", label: "Blog" },
];

const socialLinks = [
  { href: "https://www.linkedin.com/in/wrjodjana/", label: "LinkedIn" },
  { href: "https://github.com/wrjodjana", label: "GitHub" },
  { href: "mailto:jodjanawarren@gmail.com", label: "Email" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const current = pathname.startsWith("/blog") ? "blog" : "about";

  return (
    <aside className="sidebar">
      <p className="sidebar-brand">
        <Link href="/">wrjodjana.me</Link>
      </p>
      <nav aria-label="Primary navigation">
        {primaryLinks.map((l) => (
          <Link key={l.id} href={l.href} aria-current={l.id === current ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="sidebar-heading">Find me on</p>
      <nav aria-label="Social links">
        {socialLinks.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
            {l.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
