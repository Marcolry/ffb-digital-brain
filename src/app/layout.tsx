import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FFB Knowledge Graph - Normes NF DTU du Bâtiment",
  description: "Visualisation interactive des normes NF DTU de la Fédération Française du Bâtiment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="h-full overflow-hidden bg-[#0a0a0f] text-white font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
