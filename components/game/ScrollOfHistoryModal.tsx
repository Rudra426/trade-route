"use client";

import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { placeFacts } from '@/data/placeFacts';
import { historyQuiz } from '@/data/historyQuiz';
import { boardSpaces } from '@/data/boardSpaces';
import { Button } from '@/components/ui/button';
import { INITIAL_BALANCE } from '@/game/config/balance';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export function ScrollOfHistoryModal() {
  const historyEvents = useGameStore(state => state.historyEvents);
  const historyQuizEnabled = useGameStore(state => state.historyQuizEnabled);
  const awardScholarBonus = useGameStore(state => state.awardScholarBonus);
  const players = useGameStore(state => state.players);
  const { t, tCity, tFact } = useTranslation();
  
  const searchParams = useSearchParams();
  const localPlayerName = searchParams.get('player');
  const localPlayer = players.find(p => p.name === localPlayerName);

  const [lastIndex, setLastIndex] = useState(0);
  const initialized = useRef(false);

  const [quizState, setQuizState] = useState<'idle' | 'answered'>('idle');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (!initialized.current) {
      setLastIndex(historyEvents.length);
      initialized.current = true;
    }
  }, [historyEvents.length]);

  const unreadEvents = historyEvents.slice(lastIndex);
  const currentEvent = unreadEvents.length > 0 ? unreadEvents[0] : null;

  const [currentEventId, setCurrentEventId] = useState<string | undefined>(undefined);

  if (currentEvent?.id !== currentEventId) {
    setCurrentEventId(currentEvent?.id);
    setQuizState('idle');
    setSelectedOption(null);
  }

  if (!currentEvent) return null;

  const space = boardSpaces.find(s => s.id === currentEvent.spaceId);
  const eventPlayer = players.find(p => p.id === currentEvent.playerId);
  
  if (!space || !eventPlayer) {
    // If invalid, skip it immediately in a safe way without triggering render loops
    setTimeout(() => setLastIndex(prev => prev + 1), 0);
    return null;
  }

  const defaultFactData = placeFacts[space.name];
  if (!defaultFactData) {
    setTimeout(() => setLastIndex(prev => prev + 1), 0);
    return null;
  }
  const factData = tFact(space.name);

  const quiz = historyQuiz[space.name];
  const isLocalPlayerTurn = localPlayer && localPlayer.id === currentEvent.playerId;
  const showQuiz = historyQuizEnabled && isLocalPlayerTurn && quiz;

  const handleDismiss = () => {
    setLastIndex(prev => prev + 1);
  };

  const handleAnswer = (index: number) => {
    if (quizState === 'answered' || !quiz) return;
    
    setSelectedOption(index);
    setQuizState('answered');
    
    if (index === quiz.correctIndex && localPlayer) {
      awardScholarBonus(localPlayer.id);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#fdf5e6] border-4 border-[#8b5a2b] shadow-2xl max-w-lg w-full relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        {/* Parchment background effect */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8b5a2b 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
        
        <div className="p-8 relative z-10 text-center space-y-6">
          <div className="space-y-1">
            <h4 className="text-[#8b5a2b] font-bold uppercase tracking-widest text-xs">{t('scrollOfHistory')}</h4>
            <h2 className="text-3xl font-black text-[#5c3a21] uppercase tracking-wider">{tCity(space.name)}</h2>
            <div className="text-[#a0522d] font-bold text-sm">
              {factData.era} &bull; {space.colorGroup || 'Ancient India'}
            </div>
          </div>

          <div className="py-4 border-y-2 border-[#8b5a2b]/20">
            <p className="text-lg text-[#4a3219] font-serif leading-relaxed italic">
              &quot;{factData.fact}&quot;
            </p>
          </div>

          {showQuiz && (
            <div className="space-y-4 pt-2">
              <div className="bg-[#8b5a2b] text-[#fdf5e6] py-1 px-4 inline-block font-bold text-xs uppercase tracking-widest rounded-full shadow-inner mb-2">
                {t('scholarsBonus')} (+₹{INITIAL_BALANCE.SCHOLAR_BONUS})
              </div>
              <p className="text-[#5c3a21] font-bold font-serif">{quiz.question}</p>
              
              <div className="space-y-2">
                {quiz.options.map((option, idx) => {
                  let btnClass = "bg-[#f5deb3] hover:bg-[#e6c280] text-[#5c3a21] border border-[#d2b48c]";
                  
                  if (quizState === 'answered') {
                    if (idx === quiz.correctIndex) {
                      btnClass = "bg-green-600 text-white border-green-700 shadow-[0_0_15px_rgba(22,163,74,0.5)]";
                    } else if (idx === selectedOption) {
                      btnClass = "bg-red-600 text-white border-red-700";
                    } else {
                      btnClass = "bg-[#f5deb3]/50 text-[#5c3a21]/50 border-[#d2b48c]/50 cursor-not-allowed";
                    }
                  }

                  return (
                    <Button 
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={quizState === 'answered'}
                      className={`w-full py-6 font-serif font-bold transition-all ${btnClass}`}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {(!showQuiz || quizState === 'answered') && (
            <div className="pt-4">
              <Button 
                onClick={handleDismiss}
                className="bg-[#5c3a21] hover:bg-[#4a3219] text-[#fdf5e6] font-bold py-6 px-12 text-lg uppercase tracking-widest shadow-lg"
              >
                {quizState === 'answered' && selectedOption === quiz?.correctIndex ? t('claimBonusReturn') : t('returnToGame')}
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
