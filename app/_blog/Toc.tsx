"use client";

import { useEffect, useState } from "react";
import type { Heading } from "./posts";

export default function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const update = () => {
      const offset = 120;
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= offset) current = el.id;
        else break;
      }
      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headings]);

  if (headings.length === 0) return null;
  return (
    <div className="toc-wrap">
      <nav className="toc" aria-label="Table of contents">
        {headings.map((h) => (
          <a key={h.id} href={`#${h.id}`} aria-current={h.id === active ? "location" : undefined}>
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
