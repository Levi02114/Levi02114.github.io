import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://levi02114.github.io"),
  title: "Levi02114's Blog",
  description: "Personal blog with Korean and English posts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 dark:bg-neutral-950 antialiased">
        {children}
      </body>
    </html>
  );
}
