"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { supabase, generateRoomCode } from '@/utils/supabase';
import { toast } from 'sonner';
import { Cinzel } from 'next/font/google';
import { cn } from '@/lib/utils';
import { LanguageToggle } from '@/components/LanguageToggle';

const cinzel = Cinzel({ subsets: ['latin'] });

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [winCondition, setWinCondition] = useState<'CLASSIC'|'TRADE_DOMINANCE'>('CLASSIC');
  const [aiTurnSpeed, setAiTurnSpeed] = useState<'NORMAL'|'FAST'>('NORMAL');
  const [historyQuizEnabled, setHistoryQuizEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name first!");
      return;
    }

    setIsLoading(true);
    try {
      const newCode = generateRoomCode();
      
      // Attempt to create room in Supabase (will fail if DB not setup yet, which is expected for now)
      const { error } = await supabase
        .from('rooms')
        .insert([{ room_code: newCode, status: 'WAITING', game_state: {} }])
        .select()
        .single();

      if (error) throw error;

      toast.success(`Room ${newCode} created!`);
      router.push(`/play?room=${newCode}&player=${encodeURIComponent(playerName)}&win=${winCondition}&speed=${aiTurnSpeed}&quiz=${historyQuizEnabled}`);
      
    } catch (e: unknown) {
      console.error(e);
      toast.error("Database connection failed. Did you add Supabase keys to .env.local?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim() || !roomCode.trim()) {
      toast.error("Please enter both your name and a room code!");
      return;
    }

    setIsLoading(true);
    try {
      const code = roomCode.toUpperCase();
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('room_code', code)
        .single();

      if (error || !data) {
        throw new Error("Room not found");
      }

      toast.success(`Joining room ${code}...`);
      router.push(`/play?room=${code}&player=${encodeURIComponent(playerName)}`);
    } catch (e: unknown) {
      console.error(e);
      toast.error("Room not found or Database connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden", cinzel.className)}>
      <LanguageToggle />
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #f5f5f4 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/20 to-transparent pointer-events-none" />

      <div className="w-full max-w-md bg-[#e7d5b3] border-4 border-[#8b5a2b] p-8 shadow-2xl relative z-10 text-[#4a3219]">
        <h1 className="text-4xl font-black text-center text-[#5c3a21] mb-2 uppercase tracking-widest border-b-2 border-[#8b5a2b] pb-4">
          Trade Routes <br /> <span className="text-xl text-[#8b4513]">Online Lobby</span>
        </h1>

        <div className="space-y-6 mt-8">
          <div>
            <label className="block text-sm font-bold uppercase tracking-widest text-[#8b5a2b] mb-1">Your Merchant Name</label>
            <input 
              type="text" 
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="e.g. Ashoka the Great"
              className="w-full p-3 bg-[#fdf5e6] border border-[#d2b48c] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8b5a2b] text-lg font-sans"
            />
          </div>

          <div className="pt-4 border-t border-[#d2b48c] space-y-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#8b5a2b] mb-1">Win Condition</label>
                <select 
                  value={winCondition} 
                  onChange={(e) => setWinCondition(e.target.value as 'CLASSIC'|'TRADE_DOMINANCE')}
                  className="w-full p-2 bg-[#fdf5e6] border border-[#d2b48c] text-sm text-[#5c3a21] font-bold outline-none cursor-pointer"
                >
                  <option value="CLASSIC">Classic (Bankruptcy)</option>
                  <option value="TRADE_DOMINANCE">Trade Dominance (3 Monopolies)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#8b5a2b] mb-1">AI Turn Speed</label>
                <select 
                  value={aiTurnSpeed} 
                  onChange={(e) => setAiTurnSpeed(e.target.value as 'NORMAL'|'FAST')}
                  className="w-full p-2 bg-[#fdf5e6] border border-[#d2b48c] text-sm text-[#5c3a21] font-bold outline-none cursor-pointer"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="FAST">Fast</option>
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#8b5a2b] mb-1">History Quiz</label>
              <select 
                value={historyQuizEnabled ? 'ON' : 'OFF'} 
                onChange={(e) => setHistoryQuizEnabled(e.target.value === 'ON')}
                className="w-full p-2 bg-[#fdf5e6] border border-[#d2b48c] text-sm text-[#5c3a21] font-bold outline-none cursor-pointer"
              >
                <option value="ON">On (Scholar&apos;s Bonus Active)</option>
                <option value="OFF">Off</option>
              </select>
            </div>

            <Button 
              onClick={handleCreateRoom} 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#d2691e] to-[#8b4513] hover:from-[#b25918] hover:to-[#6b350e] text-[#fdf5e6] font-bold py-6 text-xl transition-all border border-[#cd853f] shadow-md uppercase tracking-widest"
            >
              Found a New Room
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-[#d2b48c]"></div>
              <span className="flex-shrink-0 mx-4 text-[#8b5a2b] uppercase text-sm font-bold tracking-widest">Or</span>
              <div className="flex-grow border-t border-[#d2b48c]"></div>
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="4-LETTER CODE"
                maxLength={4}
                className="w-full p-3 bg-[#fdf5e6] border border-[#d2b48c] shadow-inner focus:outline-none focus:ring-2 focus:ring-[#8b5a2b] text-center font-bold tracking-widest uppercase text-xl font-sans"
              />
              <Button 
                onClick={handleJoinRoom}
                disabled={isLoading || roomCode.length < 4}
                className="bg-[#5c3a21] hover:bg-[#4a3219] text-[#fdf5e6] font-bold py-6 px-8 text-lg transition-all shadow-md uppercase tracking-widest"
              >
                Join
              </Button>
            </div>
          </div>
        </div>

        <Button variant="ghost" onClick={() => router.push('/')} className="w-full mt-6 text-[#8b5a2b] hover:bg-[#d2b48c] hover:text-[#4a3219]">
          Return to Main Menu
        </Button>
      </div>
    </div>
  );
}
