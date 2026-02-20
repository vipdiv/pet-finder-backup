import { StewardLevel } from '@prisma/client';

export function StewardBadge({ level, points }: { level: StewardLevel; points: number }) {
  return <div className="stamp">Park Steward: {level.replaceAll('_', ' ')} ({points} pts)</div>;
}
