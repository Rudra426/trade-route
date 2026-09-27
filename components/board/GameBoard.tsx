import { boardSpaces } from '@/data/boardSpaces';
import { BoardSpace } from './BoardSpace';

export function GameBoard() {
  return (
    <div className="relative aspect-square w-full h-full max-h-full max-w-full min-h-0 min-w-0 flex items-center justify-center p-2">
      <div className="relative aspect-square w-full max-w-[900px] max-h-full bg-[#e7d5b3] rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.6)] border-[12px] border-[#8b5a2b]">
        {/* Stone texture overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, #5c3a21 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
      
      <div 
        className="grid w-full h-full gap-[2px] p-[2px] bg-[#5c3a21] relative z-10"
        style={{ 
          gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(9, minmax(0, 1fr))'
        }}
      >
        {/* Center Area */}
        <div 
          className="col-start-2 col-end-9 row-start-2 row-end-9 flex flex-col items-center justify-center bg-[#e7d5b3] shadow-[inset_0_0_60px_rgba(139,90,43,0.3)] relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
          
          <div className="text-center space-y-6 px-4 py-8 relative z-10">
            <div className="mx-auto w-32 h-32 mb-6 opacity-70 mix-blend-multiply flex items-center justify-center">
              {/* Ancient symbol placeholder */}
              <span className="text-[120px] text-[#8b5a2b] drop-shadow-sm">☸</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-serif font-black text-[#5c3a21] tracking-widest uppercase drop-shadow-md">Trade Routes</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] w-12 bg-[#8b5a2b]/50"></div>
              <p className="text-[#8b5a2b] font-serif text-lg md:text-2xl italic font-semibold tracking-wide">Cities of Antiquity</p>
              <div className="h-[2px] w-12 bg-[#8b5a2b]/50"></div>
            </div>
          </div>
        </div>

        {/* Render all spaces */}
        {boardSpaces.map((space) => (
          <BoardSpace key={space.id} space={space} />
        ))}
      </div>
      </div>
    </div>
  );
}
