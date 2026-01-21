import type { Metadata } from "next";
import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import "./globals.css";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { GlassNavbar } from "@/components/ui/GlassNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Sisyphus Blog",
  description: "Writing about code, architecture, and books.",
};

import { LanguageProvider } from "@/context/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} antialiased relative min-h-screen text-gray-800 dark:text-gray-200 selection:bg-stone-200 dark:selection:bg-stone-800`}
      >
        <LanguageProvider>
          <AnimatedBackground />
          <GlassNavbar />
          <main className="pt-24 sm:pt-28 md:pt-32 px-4 pb-12 sm:pb-16 md:pb-20 max-w-4xl mx-auto w-full">
            {children}
          </main>
        </LanguageProvider>
      </body>
    </html>
  );
}
