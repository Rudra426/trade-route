import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useGameStore } from "@/stores/gameStore"
import { boardSpaces } from "@/data/boardSpaces"
import { useState } from "react"

export function BuildModal() {
  const { players, currentPlayerIndex, propertyLevels, buildUpgrade, mortgageProperty, unmortgageProperty } = useGameStore();
  const player = players[currentPlayerIndex];
  const [open, setOpen] = useState(false);

  if (!player) return null;

  // Filter properties player owns
  const ownedSpaces = boardSpaces.filter(s => player.properties.includes(s.id));

  // Determine complete color groups
  const groupCounts: Record<string, number> = {};
  const totalInGroup: Record<string, number> = {};

  boardSpaces.forEach(s => {
    if (s.colorGroup) {
      totalInGroup[s.colorGroup] = (totalInGroup[s.colorGroup] || 0) + 1;
    }
  });

  ownedSpaces.forEach(s => {
    if (s.colorGroup) {
      groupCounts[s.colorGroup] = (groupCounts[s.colorGroup] || 0) + 1;
    }
  });

  const completeGroups = Object.keys(groupCounts).filter(g => groupCounts[g] === totalInGroup[g]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" className="w-full bg-[#e7d5b3] text-[#8b4513] border-[#cd853f] hover:bg-[#d2b48c] uppercase tracking-widest font-serif py-6 mt-2 shadow-inner focus-visible:ring-2 focus-visible:ring-[#8b4513] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7d5b3]">
            Manage Territories
          </Button>
        }
      />
      <DialogContent className="bg-[#f5deb3] border-4 border-[#8b5a2b] font-serif text-[#4a3219] sm:max-w-md max-h-[80vh] overflow-y-auto outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-widest text-center uppercase text-[#5c3a21] border-b-2 border-[#8b5a2b] pb-2">
            Territory Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {ownedSpaces.length === 0 ? (
            <p className="text-center italic text-[#8b5a2b] p-4 bg-[#e7d5b3] rounded shadow-inner">
              You do not own any territories yet.
            </p>
          ) : (
            ownedSpaces.map(space => {
              const currentLevel = propertyLevels[space.id] || 0;
              const maxLevel = (space.rent?.length || 1) - 1;
              const canAffordBuild = space.upgradeCost ? player.money >= space.upgradeCost : false;
              const isMaxed = currentLevel >= maxLevel;
              const canBuild = space.colorGroup && completeGroups.includes(space.colorGroup);
              const isMortgaged = (player.mortgagedProperties || []).includes(space.id);

              const levelNames = ['Empty', 'Workshop', 'Warehouse', 'Trade Hall', 'Caravanserai', 'Grand Palace'];
              const currentBuildingName = isMortgaged ? 'Mortgaged' : levelNames[Math.min(currentLevel, levelNames.length - 1)];

              const mortgageValue = space.price ? Math.floor(space.price / 2) : 0;
              const unmortgageCost = Math.floor(mortgageValue * 1.1);

              return (
                <div key={space.id} className={`flex flex-col gap-2 p-4 rounded border shadow-[inset_0_0_10px_rgba(139,90,43,0.1)] ${isMortgaged ? 'bg-stone-300 border-stone-400 opacity-80' : 'bg-[#fdf5e6] border-[#d2b48c]'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className={`font-bold text-lg ${isMortgaged ? 'text-stone-600 line-through' : 'text-[#8b4513]'}`}>{space.name}</h3>
                      <p className={`text-xs uppercase tracking-wider ${isMortgaged ? 'text-red-700 font-bold' : 'text-[#6b3e11]'}`}>
                        {currentBuildingName} {currentLevel > 0 ? `(Lvl ${currentLevel}/${maxLevel})` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {isMortgaged ? (
                        <Button 
                          size="sm"
                          onClick={() => unmortgageProperty(space.id)}
                          disabled={player.money < unmortgageCost}
                          className="bg-green-700 hover:bg-green-800 text-white focus-visible:ring-2 focus-visible:ring-green-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf5e6]"
                        >
                          Reclaim (₹{unmortgageCost})
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => mortgageProperty(space.id)}
                          disabled={currentLevel > 0}
                          className="bg-red-700 hover:bg-red-800 text-white focus-visible:ring-2 focus-visible:ring-red-800 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf5e6]"
                        >
                          Mortgage (₹{mortgageValue})
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Build Row */}
                  {!isMortgaged && canBuild && space.upgradeCost && (
                    <div className="flex justify-end border-t border-[#d2b48c] pt-2 mt-1">
                      <Button 
                        size="sm"
                        onClick={() => buildUpgrade(space.id)}
                        disabled={isMaxed || !canAffordBuild}
                        className="bg-[#d2691e] hover:bg-[#8b4513] text-[#fdf5e6] border border-[#cd853f] focus-visible:ring-2 focus-visible:ring-[#8b4513] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fdf5e6]"
                      >
                        {isMaxed ? 'Maxed' : `Build Upgrade (₹${space.upgradeCost})`}
                      </Button>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
