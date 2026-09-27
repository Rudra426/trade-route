import { useEffect, useState } from 'react';

interface Dice3DProps {
  value: number;
  rolling: boolean;
}

const Dot = ({ visible }: { visible: boolean }) => (
  <div className={`w-2.5 h-2.5 bg-leather rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] ${visible ? 'opacity-100' : 'opacity-0'}`}></div>
);

const Face = ({ transform, dots }: { transform: string, dots: boolean[] }) => (
  <div 
    className="absolute w-full h-full bg-sandstone border-2 border-leather shadow-[inset_0_0_10px_rgba(92,58,33,0.5)] rounded-md p-1.5 backface-hidden"
    style={{ transform }}
  >
    <div className="grid grid-cols-3 grid-rows-3 w-full h-full place-items-center">
      {dots.map((visible, i) => <Dot key={i} visible={visible} />)}
    </div>
  </div>
);

export function Dice3D({ value, rolling }: Dice3DProps) {
  const [rotations, setRotations] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (rolling && value) {
      const currentX = rotations.x - (rotations.x % 360);
      const currentY = rotations.y - (rotations.y % 360);
      
      const spinsX = 360 * 3;
      const spinsY = 360 * 4;

      let targetX = currentX + spinsX;
      let targetY = currentY + spinsY;

      switch(value) {
        case 1: targetX += 0; targetY += 0; break;
        case 2: targetX += 0; targetY -= 90; break;
        case 3: targetX -= 90; targetY += 0; break;
        case 4: targetX += 90; targetY += 0; break;
        case 5: targetX += 0; targetY += 90; break;
        case 6: targetX += 180; targetY += 0; break;
      }
      
      const jitterX = (Math.floor(Math.random() * 2) + 1) * 360;
      const jitterY = (Math.floor(Math.random() * 2) + 1) * 360;
      
      setRotations({ x: targetX + jitterX, y: targetY + jitterY });
    }
  }, [rolling, value]);

  // 3x3 grid dot visibility for each face
  const face1 = [false, false, false, false, true, false, false, false, false];
  const face2 = [true, false, false, false, false, false, false, false, true];
  const face3 = [true, false, false, false, true, false, false, false, true];
  const face4 = [true, false, true, false, false, false, true, false, true];
  const face5 = [true, false, true, false, true, false, true, false, true];
  const face6 = [true, false, true, true, false, true, true, false, true];

  return (
    <div className="w-16 h-16" style={{ perspective: '800px' }}>
      <div 
        className="w-full h-full relative"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotations.x}deg) rotateY(${rotations.y}deg)`,
          transition: 'transform 1.5s cubic-bezier(0.1, 0.9, 0.2, 1)'
        }}
      >
        <Face transform="translateZ(32px)" dots={face1} />
        <Face transform="rotateY(90deg) translateZ(32px)" dots={face2} />
        <Face transform="rotateX(90deg) translateZ(32px)" dots={face3} />
        <Face transform="rotateX(-90deg) translateZ(32px)" dots={face4} />
        <Face transform="rotateY(-90deg) translateZ(32px)" dots={face5} />
        <Face transform="rotateY(180deg) translateZ(32px)" dots={face6} />
      </div>
    </div>
  );
}
