import type { Metadata } from "next";
import "./globals.css";
import { NavbarWrapper } from "@/components/NavbarWrapper";

export const metadata: Metadata = {
  title: "AffiliatePro - En İyi Ürün Tavsiyeleri",
  description: "En iyi ürün tavsiyeleri ve affiliate linkler",
  openGraph: {
    title: "AffiliatePro - En İyi Ürün Tavsiyeleri",
    description: "En iyi ürün tavsiyeleri ve affiliate linkler",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-gray-900 text-gray-100">
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <NavbarWrapper />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
