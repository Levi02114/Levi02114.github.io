import type { Metadata } from "next";
import "./globals.css";
import { getCategoryTree } from "@/lib/posts";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://levi02114.github.io"),
  title: "Levi02114 Notes",
  description: "개인 블로그",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getCategoryTree();

  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        <AppShell categories={categories}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
