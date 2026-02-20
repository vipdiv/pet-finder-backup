'use client';

export function ShareButton({ id }: { id: string }) {
  return (
    <button
      className="text-xs underline"
      onClick={async () => {
        const url = `${window.location.origin}/sightings#${id}`;
        await navigator.clipboard.writeText(url);
      }}
    >
      Share
    </button>
  );
}
