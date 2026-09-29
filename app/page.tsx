"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RulesModal } from "@/components/home/RulesModal";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <LanguageToggle />
      {/* Cinematic Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      {/* Dark vignette gradient to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-ink/90 via-ink/60 to-ink/30" />
      
      <div className="max-w-4xl text-center space-y-8 z-10 p-12 bg-sandstone/10 backdrop-blur-md rounded-3xl border border-sandstone/30 shadow-2xl relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none rounded-3xl" style={{ backgroundImage: 'radial-gradient(circle at center, var(--color-sandstone) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <h1 className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-sandstone-light via-gold to-terracotta tracking-tighter drop-shadow-2xl font-black relative z-10">
          TRADE ROUTES
        </h1>
        <p className="text-xl md:text-2xl text-sandstone font-medium max-w-2xl mx-auto font-serif italic relative z-10 drop-shadow-md">
          Journey through the ancient markets of the Indus and beyond. Acquire legendary cities, build vast trade empires, and become the wealthiest merchant of antiquity.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-12 relative z-10">
          <Link href="/play" className="w-full sm:w-auto">
            <Button size="lg" className="w-full py-8 text-xl">
              {t('beginJourney')}
            </Button>
          </Link>
          <Link href="/lobby" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full py-8 text-xl">
              {t('gameLobby')}
            </Button>
          </Link>
          <RulesModal />
        </div>
      </div>
    </main>
  );
}
