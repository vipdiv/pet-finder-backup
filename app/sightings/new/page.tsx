import { createSighting } from '@/app/actions';
import { prisma } from '@/lib/prisma';
import { ViewerField } from '@/components/viewer-field';
import { DEFAULT_NEIGHBORHOOD } from '@/lib/constants';

export default async function NewSightingPage() {
  const missing = await prisma.pet.findMany({ where: { status: 'MISSING', hidden: false }, orderBy: { createdAt: 'desc' }, take: 8 });
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-park">Post a Sighting</h1>
      <p className="rounded border border-stamp/40 bg-orange-50 p-3 text-sm">Do not chase or corner animals. If aggressive or injured, call local animal services.</p>
      <form action={createSighting} className="frame-card space-y-3">
        <ViewerField />
        <input type="hidden" name="neighborhood" value={DEFAULT_NEIGHBORHOOD} />
        <label className="block text-sm">Species<select name="species" className="mt-1 w-full rounded border p-2"><option>DOG</option><option>CAT</option><option>OTHER</option></select></label>
        <label className="block text-sm">Photo<input name="photo" required type="file" accept="image/*" className="mt-1 w-full" /></label>
        <label className="block text-sm">Location text<input name="locationText" required className="mt-1 w-full rounded border p-2" placeholder="Under the bridge by the tennis court" /></label>
        <label className="block text-sm">Seen time<input name="seenAt" type="datetime-local" className="mt-1 w-full rounded border p-2" /></label>
        <label className="block text-sm">Notes<textarea name="notes" className="mt-1 w-full rounded border p-2" /></label>
        <label className="block text-sm">Known missing pet match (optional)
          <select name="petId" className="mt-1 w-full rounded border p-2"><option value="">Unknown</option>{missing.map((m)=><option value={m.id} key={m.id}>{m.name || 'Unnamed'} ({m.species})</option>)}</select>
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="canWait" />I can wait here</label>
        <select name="waitMinutes" className="w-full rounded border p-2"><option value="">No wait</option><option>10</option><option>20</option><option>30</option><option>45</option></select>
        <button className="rounded bg-park px-4 py-2 text-white">Submit sighting</button>
      </form>

      <section className="frame-card">
        <h2 className="font-serif text-xl text-park">Possible matches</h2>
        <p className="text-sm">Recent missing pets in Lawndale Park by species.</p>
        <ul className="mt-2 space-y-1 text-sm">{missing.slice(0,5).map((m)=><li key={m.id}>{m.name || 'Unnamed'} — {m.species}</li>)}</ul>
      </section>
    </div>
  );
}
