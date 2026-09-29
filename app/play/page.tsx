"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { GameBoard } from '@/components/board/GameBoard';
import { PlayerPanel } from '@/components/game/PlayerPanel';
import { TurnPanel } from '@/components/game/TurnPanel';
import { ActionLog } from '@/components/game/ActionLog';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { ScrollOfHistoryModal } from '@/components/game/ScrollOfHistoryModal';

import { Suspense } from 'react';

function PlayPageContent() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('room');
  const playerName = searchParams.get('player');
  const router = useRouter();

  const initGame = useGameStore(state => state.initGame);
  const players = useGameStore(state => state.players);
  const [mounted, setMounted] = useState(false);
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    // If no room code, run local offline initialization
    if (!roomCode) {
      if (useGameStore.getState().players.length === 0) {
        initGame([
          { id: 'p1', name: 'Merchant Ashoka', token: 'elephant', color: '#ea580c', isAI: false },
          { id: 'p2', name: 'Trader Bindusara', token: 'camel', color: '#0284c7', isAI: true }
        ]);
      }
      return;
    }

    // ONLINE MULTIPLAYER LOGIC
    let sub: ReturnType<typeof supabase.channel>;
    let unsubStore: () => void;

    const setupOnlineGame = async () => {
      try {
        const { data, error } = await supabase.from('rooms').select('game_state').eq('room_code', roomCode).single();
        if (error || !data) {
          toast.error("Room not found!");
          router.push('/lobby');
          return;
        }

        // Initialize state if empty
        if (!data.game_state || Object.keys(data.game_state).length === 0) {
          const winCondition = searchParams.get('win') as 'CLASSIC' | 'TRADE_DOMINANCE' || 'CLASSIC';
          const aiTurnSpeed = searchParams.get('speed') as 'NORMAL' | 'FAST' || 'NORMAL';
          const historyQuizEnabled = searchParams.get('quiz') !== 'false';
          useGameStore.getState().initGame([], winCondition, aiTurnSpeed, historyQuizEnabled); // Empty game
          useGameStore.getState().setPhase('LOBBY');
          useGameStore.getState().addPlayerToLobby({
            id: 'p1', name: playerName || 'Host', token: 'elephant', color: '#ea580c', isAI: false
          });
          await supabase.from('rooms').update({ game_state: useGameStore.getState() }).eq('room_code', roomCode);
        } else {
          isRemoteUpdate.current = true;
          useGameStore.setState(data.game_state);
          isRemoteUpdate.current = false;

          // Now add this player if they are new and it's still LOBBY phase
          if (useGameStore.getState().phase === 'LOBBY') {
            const currentPlayers = useGameStore.getState().players;
            if (!currentPlayers.find(p => p.name === playerName)) {
              // Create a unique ID and generic token based on index
              const nextId = `p${currentPlayers.length + 1}`;
              const tokens = ['elephant', 'camel', 'ship', 'horse'];
              const colors = ['#ea580c', '#0284c7', '#16a34a', '#9333ea'];
              
              useGameStore.getState().addPlayerToLobby({
                id: nextId,
                name: playerName || `Player ${currentPlayers.length + 1}`,
                token: tokens[currentPlayers.length] as 'elephant' | 'camel' | 'ship' | 'horse',
                color: colors[currentPlayers.length],
                isAI: false
              });
              // push to supabase manually since the listener will pick it up
              await supabase.from('rooms').update({ game_state: useGameStore.getState() }).eq('room_code', roomCode);
            }
          }
        }

        // Subscribe to remote changes
        sub = supabase.channel(`room:${roomCode}-${Math.random()}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `room_code=eq.${roomCode}` }, (payload) => {
            const remoteVersion = payload.new.game_state?.version || 0;
            const localVersion = useGameStore.getState().version || 0;
            
            // Only apply updates that are newer than our local state
            if (remoteVersion > localVersion) {
              isRemoteUpdate.current = true;
              useGameStore.setState(payload.new.game_state);
              isRemoteUpdate.current = false;
            }
          })
          .subscribe();

        // Subscribe to local changes and push to remote
        unsubStore = useGameStore.subscribe((state) => {
          if (!isRemoteUpdate.current) {
            supabase.from('rooms').update({ game_state: state }).eq('room_code', roomCode).then();
          }
        });

      } catch (e) {
        console.error(e);
        toast.error("Failed to connect to room.");
      }
    };

    setupOnlineGame();

    return () => {
      if (sub) {
        supabase.removeChannel(sub);
      }
      if (unsubStore) unsubStore();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, playerName, router]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted || players.length === 0) return null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-stone-950 text-stone-100 flex flex-col md:flex-row relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #f5f5f4 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      
      {/* Left side: Game Board - Will perfectly fit remaining space */}
      <div className="flex-1 h-full flex items-center justify-center p-2 md:p-8 z-10 overflow-hidden">
        <GameBoard />
      </div>
      
      <ScrollOfHistoryModal />

      {/* Right side: Panels */}
      <div className="w-full md:w-[450px] bg-stone-900/90 backdrop-blur-md border-l border-stone-800 flex flex-col h-full overflow-y-auto z-10 shadow-2xl shrink-0">
        <TurnPanel />
        <div className="p-6 space-y-6 flex-1 flex flex-col">
          <div className="space-y-4 flex-none">
            {players.map(p => (
              <PlayerPanel key={p.id} player={p} />
            ))}
          </div>
          <div className="flex-1 min-h-[200px] flex flex-col justify-end mt-4">
            <ActionLog />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-stone-950 flex items-center justify-center text-stone-400 font-serif text-2xl tracking-widest">Loading...</div>}>
      <PlayPageContent />
    </Suspense>
  );
}
