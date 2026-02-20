'use client';

import { useState } from 'react';

export function AboutModal() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="text-sm underline" onClick={() => setOpen(true)}>About</button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="mx-auto mt-10 max-w-md rounded-xl bg-paper p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-2xl text-park">About this board</h2>
            <div className="mt-3 space-y-3 text-sm">
              <section><h3 className="font-semibold">What this is</h3><p>A neighborhood board for Lawndale Park sightings, missing pets, and familiar park regulars so neighbors can help quickly and calmly.</p></section>
              <section><h3 className="font-semibold">When to post</h3><p>Share sightings, missing pet reports, and quick “I’m here now” updates when timing matters.</p></section>
              <section><h3 className="font-semibold">Regulars</h3><p>Some pets are known park regulars. This helps reduce panic while still sharing updates.</p></section>
              <section><h3 className="font-semibold">Safety first</h3><p>Do not chase, corner, or try to grab animals. If an animal seems injured or aggressive, call local animal services.</p></section>
              <section><h3 className="font-semibold">Privacy</h3><p>Don’t post exact addresses. Use landmarks like the bridge, tennis courts, pavilion, or trail.</p></section>
              <section><h3 className="font-semibold">Be a good neighbor</h3><p>Kind, factual updates help most: “Seen 15 min ago near the tennis courts; I can wait 20 min.”</p></section>
            </div>
            <p className="mt-3 text-xs text-sepia">Built for Lawndale Park — by neighbors who want pets home safe.</p>
          </div>
        </div>
      )}
    </>
  );
}
