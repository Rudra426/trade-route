import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

export function LobbyPanel() {
  const { players, togglePlayerReady, startGame } = useGameStore();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('room');
  const playerName = searchParams.get('player');

  const myPlayer = players.find(p => p.name === playerName);
  const isHost = players.length > 0 && players[0].name === playerName;
  const allReady = players.every(p => p.isReady);

  return (
    <div className="p-6 border-b border-stone-800 bg-stone-900/60 backdrop-blur-sm space-y-6 shadow-xl font-serif">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-wide text-[#e7d5b3] drop-shadow-md uppercase">
          Online Lobby
        </h2>
        {roomCode && (
          <p className="mt-2 text-stone-400">
            Room Code: <span className="font-mono text-amber-500 font-bold text-xl tracking-widest bg-stone-800 px-2 py-1 rounded">{roomCode}</span>
          </p>
        )}
      </div>

      <div className="space-y-3">
        {players.map((p, i) => (
          <div key={p.id} className="flex justify-between items-center bg-stone-800/80 p-3 rounded border border-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.color }}></div>
              <span className="text-stone-200 font-bold text-lg">{p.name} {i === 0 && '(Host)'}</span>
            </div>
            <span className={p.isReady ? "text-green-500 font-bold" : "text-stone-500"}>
              {p.isReady ? 'READY' : 'WAITING'}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-4 space-y-4">
        {myPlayer && (
          <Button 
            onClick={() => togglePlayerReady(myPlayer.id)}
            variant={myPlayer.isReady ? "outline" : "default"}
            className={`w-full py-6 text-xl uppercase tracking-widest font-bold transition-all ${
              myPlayer.isReady 
                ? 'border-green-600 text-green-500 hover:bg-green-900/20' 
                : 'bg-green-700 hover:bg-green-600 text-stone-50 shadow-[0_0_15px_rgba(21,128,61,0.4)]'
            }`}
          >
            {myPlayer.isReady ? 'Cancel Ready' : 'Ready Up'}
          </Button>
        )}

        {isHost && (
          <Button 
            onClick={startGame}
            disabled={!allReady || players.length < 2}
            className="w-full bg-gradient-to-r from-amber-700 to-orange-600 hover:from-amber-600 hover:to-orange-500 text-stone-50 font-bold py-6 text-xl transition-all border border-amber-500/50 shadow-md uppercase tracking-widest disabled:opacity-50 disabled:grayscale"
          >
            {players.length < 2 ? 'Waiting for players...' : 'Commence Trade'}
          </Button>
        )}
      </div>
    </div>
  );
}
