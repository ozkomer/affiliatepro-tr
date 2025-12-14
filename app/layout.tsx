import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AffiliatePro - En İyi Ürün Tavsiyeleri",
  description: "En iyi ürün tavsiyeleri ve affiliate linkler",
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
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
