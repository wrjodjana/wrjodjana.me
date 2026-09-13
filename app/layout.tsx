import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Warren Jodjana",
  description: "I experiment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="site antialiased">
        <Sidebar />
        <main>{children}</main>
      </body>
    </html>
  );
}
