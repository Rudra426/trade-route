import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { LanguageSyncer } from "@/components/LanguageSyncer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Trade Routes - Ancient India",
  description: "A turn-based property-and-trade board game set around ancient Indian trade cities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-stone-950 font-sans antialiased text-stone-100",
          inter.variable,
          cinzel.variable
        )}
      >
        <LanguageSyncer />
        {children}
        <Toaster theme="dark" position="top-left" visibleToasts={3} toastOptions={{ className: 'font-serif border-[#8b5a2b] bg-[#e7d5b3] text-[#4a3219]' }} />
      </body>
    </html>
  );
}
