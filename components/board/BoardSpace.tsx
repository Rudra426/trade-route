import { BoardSpace as IBoardSpace } from '@/types/board';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/stores/gameStore';
import { useState } from 'react';
import { placeFacts } from '@/data/placeFacts';

function getGridArea(position: number) {
  if (position >= 0 && position <= 8) {
    return { gridRow: 9, gridColumn: 9 - position };
  } else if (position >= 9 && position <= 16) {
    return { gridRow: 9 - (position - 8), gridColumn: 1 };
  } else if (position >= 17 && position <= 24) {
    return { gridRow: 1, gridColumn: 1 + (position - 16) };
  } else if (position >= 25 && position <= 31) {
    return { gridRow: 1 + (position - 24), gridColumn: 9 };
  }
  return { gridRow: 1, gridColumn: 1 };
}

const colorMap: Record<string, string> = {
  'brown': 'bg-[#8b4513]',      // SaddleBrown
  'light-blue': 'bg-[#4682b4]', // SteelBlue
  'pink': 'bg-[#cd5c5c]',       // IndianRed
  'orange': 'bg-[#d2691e]',     // Chocolate
  'red': 'bg-[#b22222]',        // FireBrick
  'yellow': 'bg-[#daa520]',     // GoldenRod
  'dark-blue': 'bg-[#27408b]'   // RoyalBlue
};

import { TokenIcon } from '@/components/game/TokenIcon';

export function BoardSpace({ space }: { space: IBoardSpace }) {
  const { gridRow, gridColumn } = getGridArea(space.position);
  const players = useGameStore(state => state.players);
  const playersOnSpace = players.filter(p => p.position === space.position);

  const isCorner = space.position % 8 === 0;

  const owner = players.find(p => p.properties.includes(space.id));
  const propertyLevels = useGameStore(state => state.propertyLevels);
  const currentLevel = propertyLevels[space.id] || 0;

  const [isFlipped, setIsFlipped] = useState(false);
  const factData = placeFacts[space.name];

  const handleFlip = () => {
    if (factData) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className="relative w-full h-full select-none"
      style={{ gridRow, gridColumn, perspective: '1000px' }}
    >
      <div 
        className={cn(
          "relative w-full h-full transition-transform",
          factData ? "cursor-pointer" : ""
        )}
        style={{ 
          transformStyle: 'preserve-3d', 
          transition: 'transform 400ms ease-in-out',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={handleFlip}
      >
        {/* Front Face */}
        <div 
          className={cn(
            "absolute inset-0 flex flex-col bg-[#fdf5e6] shadow-[inset_0_0_15px_rgba(139,90,43,0.1)] overflow-hidden hover:brightness-105 hover:shadow-[inset_0_0_20px_rgba(139,90,43,0.15)] transition-all duration-200",
            isCorner ? "p-2 items-center justify-center bg-[#f5deb3] border border-[#d2b48c]" : "p-0"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {!isCorner && space.colorGroup && (
            <div className={cn("h-[24%] w-full border-b-4 border-[#5c3a21] shadow-sm relative flex items-center justify-center gap-[2px]", colorMap[space.colorGroup])}>
              {/* Building level dots */}
              {Array.from({ length: currentLevel }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full border border-black shadow-sm" />
              ))}

              {owner && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-2 rounded-b shadow-md z-10" style={{ backgroundColor: owner.color }} title={`Owned by ${owner.name}`} />
              )}
            </div>
          )}
          
          <div className={cn("flex flex-col flex-1 items-center justify-start text-center p-1 relative z-10", isCorner && "justify-center")}>
            <span className={cn("font-serif font-bold text-[8px] md:text-[11px] leading-tight text-[#4a3219] uppercase tracking-tighter mt-1", isCorner && "text-[10px] md:text-sm")}>
              {space.name}
            </span>
            {space.price && (
              <span className="text-[10px] md:text-xs text-[#8b5a2b] mt-auto font-black font-sans mb-1">
                ₹{space.price}
              </span>
            )}
          </div>
        </div>

        {/* Back Face (Historical Fact) */}
        {factData && (
          <div 
            className="absolute inset-0 flex flex-col items-center text-center p-1 bg-[#fdf5e6] border-2 border-[#d2b48c] shadow-[inset_0_0_15px_rgba(139,90,43,0.1)] overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="flex-1 flex flex-col justify-center items-center w-full">
              <h4 className="font-serif font-bold text-[8px] md:text-[10px] text-[#4a3219] leading-none mb-0.5 w-full truncate px-1">
                {space.name}
              </h4>
              <span className="text-[5px] md:text-[6.5px] font-bold text-[#8b5a2b] uppercase tracking-wider mb-1">
                {factData.era}
              </span>
              <p className="text-[6px] md:text-[7.5px] text-[#5c3a21] italic leading-[1.15] w-full px-0.5 line-clamp-4 md:line-clamp-5">
                {factData.fact}
              </p>
            </div>
            <span className="text-[5px] md:text-[6px] text-[#8b5a2b]/80 uppercase tracking-widest pt-0.5 border-t border-[#d2b48c]/40 w-[90%] shrink-0">
              Tap to flip
            </span>
          </div>
        )}
      </div>

      {/* Players on this space (anchored outside flip container) */}
      {playersOnSpace.length > 0 && (
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-1 p-1 pointer-events-none z-20">
          {playersOnSpace.map((player) => (
            <div 
              key={player.id} 
              className="drop-shadow-[0_0_5px_rgba(0,0,0,0.6)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-bounce relative"
              style={{ zIndex: 30 + player.id.charCodeAt(player.id.length - 1) }}
              title={player.name}
            >
              <TokenIcon token={player.token} color={player.color} className="w-6 h-6 md:w-8 md:h-8" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
