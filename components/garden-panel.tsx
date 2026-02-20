export function GardenPanel({ reunionCount, regularCount }: { reunionCount: number; regularCount: number }) {
  const benches = Math.floor(regularCount / 5);
  return (
    <div className="frame-card">
      <h3 className="font-serif text-xl text-park">Lawndale Garden</h3>
      <p className="text-sm text-stone-700">Each reunion plants a tree. Every 5 regulars confirmed adds a bench.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xl">
        {Array.from({ length: reunionCount }).map((_, i) => <span key={`t-${i}`}>🌳</span>)}
        {Array.from({ length: benches }).map((_, i) => <span key={`b-${i}`}>🪑</span>)}
        {reunionCount === 0 && benches === 0 ? <span className="text-sm">No markers yet — your calm updates help this grow.</span> : null}
      </div>
    </div>
  );
}
