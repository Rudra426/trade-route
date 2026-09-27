import { Player } from '@/types/player';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';

import { TokenIcon } from './TokenIcon';

export function PlayerPanel({ player }: { player: Player }) {
  const currentPlayerIndex = useGameStore(state => state.currentPlayerIndex);
  const players = useGameStore(state => state.players);
  const isCurrentTurn = players[currentPlayerIndex]?.id === player.id;

  return (
    <div className={cn(
      "p-4 rounded border-2 transition-all font-serif relative overflow-hidden",
      isCurrentTurn ? "border-[#d2691e] bg-stone-800/90 shadow-[0_0_20px_rgba(210,105,30,0.15)]" : "border-stone-800 bg-stone-900/50 opacity-80"
    )}>
      {isCurrentTurn && (
        <div className="absolute top-0 left-0 w-1 h-full bg-[#d2691e]" />
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="drop-shadow-md bg-stone-800/50 w-12 h-12 rounded flex items-center justify-center border border-stone-700">
            <TokenIcon token={player.token} color={player.color} className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-stone-100" style={{ color: player.color }}>{player.name}</h3>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">Merchant</div>
          </div>
        </div>
        <div className="text-3xl font-bold text-[#daa520] drop-shadow-sm font-sans tracking-tighter">
          <span className="text-sm font-serif text-[#daa520]/80 mr-1">₹</span>
          {player.money}
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs text-stone-400 border-t border-stone-800 pt-3 mt-2">
        <span className="uppercase tracking-wider">Properties: <span className="text-stone-200 font-bold">{player.properties.length}</span></span>
        {player.isInDetention && (
          <span className="text-red-400 bg-red-900/20 px-2 py-1 rounded">In Detention</span>
        )}
      </div>
    </div>
  );
}
