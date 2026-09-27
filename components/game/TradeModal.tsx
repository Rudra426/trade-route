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

export function TradeModal() {
  const { players, currentPlayerIndex, proposeTrade } = useGameStore();
  const currentPlayer = players[currentPlayerIndex];
  
  const [open, setOpen] = useState(false);
  const [targetPlayerId, setTargetPlayerId] = useState<string>('');
  
  const [offeredMoney, setOfferedMoney] = useState(0);
  const [offeredProps, setOfferedProps] = useState<string[]>([]);
  
  const [requestedMoney, setRequestedMoney] = useState(0);
  const [requestedProps, setRequestedProps] = useState<string[]>([]);

  if (!currentPlayer) return null;

  const targetPlayer = players.find(p => p.id === targetPlayerId);
  const otherPlayers = players.filter(p => p.id !== currentPlayer.id);

  if (!targetPlayerId && otherPlayers.length > 0) {
    setTargetPlayerId(otherPlayers[0].id);
  }

  const toggleArray = (arr: string[], val: string) => 
    arr.includes(val) ? arr.filter(i => i !== val) : [...arr, val];

  const handlePropose = () => {
    if (!targetPlayerId) return;
    proposeTrade({
      fromPlayerId: currentPlayer.id,
      toPlayerId: targetPlayerId,
      offeredMoney,
      offeredProperties: offeredProps,
      requestedMoney,
      requestedProperties: requestedProps
    });
    setOpen(false);
    setOfferedMoney(0);
    setOfferedProps([]);
    setRequestedMoney(0);
    setRequestedProps([]);
  };

  const currentProps = boardSpaces.filter(s => currentPlayer.properties.includes(s.id));
  const targetProps = targetPlayer ? boardSpaces.filter(s => targetPlayer.properties.includes(s.id)) : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" className="w-full bg-[#fdf5e6] text-[#8b5a2b] border-[#d2b48c] hover:bg-[#f5deb3] uppercase tracking-widest font-serif py-6 mt-2 shadow-inner focus-visible:ring-2 focus-visible:ring-[#8b5a2b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7d5b3]">
            Diplomacy &amp; Trade
          </Button>
        }
      />
      <DialogContent className="bg-[#e7d5b3] border-4 border-[#8b5a2b] font-serif text-[#4a3219] max-w-2xl max-h-[85vh] overflow-y-auto outline-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-widest text-center uppercase text-[#5c3a21] border-b-2 border-[#8b5a2b] pb-2">
            Propose Trade Agreement
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-2 space-y-4">
          <div className="flex justify-center gap-4">
            {otherPlayers.map(p => (
              <Button 
                key={p.id} 
                variant={targetPlayerId === p.id ? 'default' : 'outline'}
                onClick={() => setTargetPlayerId(p.id)}
                className={targetPlayerId === p.id ? "bg-[#8b4513] text-white focus-visible:ring-2 focus-visible:ring-[#8b5a2b]" : "border-[#8b5a2b] text-[#8b5a2b] hover:bg-[#d2b48c] focus-visible:ring-2 focus-visible:ring-[#8b5a2b]"}
              >
                Trade with {p.name}
              </Button>
            ))}
          </div>

          {targetPlayer && (
            <div className="grid grid-cols-2 gap-4">
              {/* Left Side: You offer */}
              <div className="bg-[#fdf5e6] p-4 rounded border border-[#d2b48c] shadow-inner space-y-4">
                <h3 className="font-bold text-center border-b border-[#d2b48c] pb-2 text-[#b22222] uppercase tracking-widest">You Offer</h3>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#8b5a2b] font-bold">Gold (Max ₹{currentPlayer.money})</label>
                  <input 
                    type="range" min="0" max={currentPlayer.money} step="10"
                    value={offeredMoney}
                    onChange={(e) => setOfferedMoney(Number(e.target.value))}
                    className="w-full mt-1 accent-[#b22222] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5a2b]"
                  />
                  <div className="text-center font-bold text-xl text-[#b22222]">₹{offeredMoney}</div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#8b5a2b] font-bold">Territories</label>
                  {currentProps.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => setOfferedProps(toggleArray(offeredProps, s.id))}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOfferedProps(toggleArray(offeredProps, s.id)); }}
                      className={`p-1 px-2 border rounded cursor-pointer text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5a2b] ${offeredProps.includes(s.id) ? 'bg-[#b22222] text-white border-[#8b0000]' : 'border-[#d2b48c] hover:bg-[#f5deb3]'}`}
                    >
                      {s.name}
                    </div>
                  ))}
                  {currentProps.length === 0 && <p className="text-xs italic text-stone-500">No territories to offer.</p>}
                </div>
              </div>

              {/* Right Side: You request */}
              <div className="bg-[#fdf5e6] p-4 rounded border border-[#d2b48c] shadow-inner space-y-4">
                <h3 className="font-bold text-center border-b border-[#d2b48c] pb-2 text-[#27408b] uppercase tracking-widest">You Request</h3>
                <div>
                  <label className="text-xs uppercase tracking-wider text-[#8b5a2b] font-bold">Gold (Max ₹{targetPlayer.money})</label>
                  <input 
                    type="range" min="0" max={targetPlayer.money} step="10"
                    value={requestedMoney}
                    onChange={(e) => setRequestedMoney(Number(e.target.value))}
                    className="w-full mt-1 accent-[#27408b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5a2b]"
                  />
                  <div className="text-center font-bold text-xl text-[#27408b]">₹{requestedMoney}</div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#8b5a2b] font-bold">Territories</label>
                  {targetProps.map(s => (
                    <div 
                      key={s.id} 
                      onClick={() => setRequestedProps(toggleArray(requestedProps, s.id))}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRequestedProps(toggleArray(requestedProps, s.id)); }}
                      className={`p-1 px-2 border rounded cursor-pointer text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5a2b] ${requestedProps.includes(s.id) ? 'bg-[#27408b] text-white border-[#00008b]' : 'border-[#d2b48c] hover:bg-[#f5deb3]'}`}
                    >
                      {s.name}
                    </div>
                  ))}
                  {targetProps.length === 0 && <p className="text-xs italic text-stone-500">No territories to request.</p>}
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handlePropose}
            disabled={!targetPlayer || (offeredMoney === 0 && offeredProps.length === 0 && requestedMoney === 0 && requestedProps.length === 0)}
            className="w-full bg-gradient-to-r from-[#d2691e] to-[#8b4513] hover:from-[#b25918] hover:to-[#6b350e] text-[#fdf5e6] font-bold py-6 text-xl transition-all border-2 border-[#cd853f] shadow-md uppercase tracking-widest disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[#cd853f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e7d5b3]"
          >
            Send Emissary
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
