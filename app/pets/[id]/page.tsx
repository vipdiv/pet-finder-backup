import { addComment, confirmReunion } from '@/app/actions';
import { ReportForm } from '@/components/report-form';
import { ViewerField } from '@/components/viewer-field';
import { VoteForm } from '@/components/vote-form';
import { prisma } from '@/lib/prisma';

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const pet = await prisma.pet.findUniqueOrThrow({ where: { id: params.id } });
  const sightings = await prisma.sighting.findMany({ where: { petId: params.id, hidden: false }, orderBy: { seenAt: 'asc' } });
  const comments = await prisma.comment.findMany({ where: { petId: params.id, hidden: false }, orderBy: { createdAt: 'asc' } });
  const reunion = await prisma.reunion.findFirst({ where: { petId: params.id }, orderBy: { confirmedAt: 'desc' } });

  return (
    <div className="space-y-4">
      <section className="frame-card">
        <span className="stamp">{reunion ? 'REUNITED' : pet.status}</span>
        <h1 className="mt-2 font-serif text-3xl text-park">{pet.name || 'Unnamed'} ({pet.species})</h1>
        <img src={pet.primaryPhotoUrl} alt={pet.name ?? 'pet'} className="mt-3 h-56 w-full rounded object-cover" />
        <p className="mt-2 text-sm">{pet.description}</p>
        {pet.contactInfo ? <p className="text-sm font-semibold">Contact: {pet.contactInfo}</p> : null}
        <a href={`/sightings/new?petId=${pet.id}`} className="mt-2 inline-block text-sm underline">Add a Sighting for this Pet</a>
        <ReportForm targetType="PET" targetId={pet.id} />
      </section>

      <section className="frame-card">
        <h2 className="font-serif text-xl">Sightings</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {sightings.map((s) => <li key={s.id}>{s.locationText} — {new Date(s.seenAt).toLocaleString()}</li>)}
        </ul>
      </section>

      <section className="frame-card">
        <h2 className="font-serif text-xl">Comments</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {comments.map((c) => (
            <li key={c.id}>
              {c.body}
              <div className="flex gap-2"><VoteForm targetType="COMMENT" targetId={c.id} /><ReportForm targetType="COMMENT" targetId={c.id} /></div>
            </li>
          ))}
        </ul>
        <form action={addComment} className="mt-3 space-y-2">
          <ViewerField />
          <input type="hidden" name="petId" value={pet.id} />
          <textarea name="body" required className="w-full rounded border p-2" placeholder="Share a calm, factual update" />
          <button className="rounded bg-park px-3 py-2 text-white">Add comment</button>
        </form>
      </section>

      {!reunion ? (
        <form action={confirmReunion} className="frame-card space-y-2">
          <ViewerField />
          <input type="hidden" name="petId" value={pet.id} />
          <label className="block text-sm">Reunion note<input name="note" className="mt-1 w-full rounded border p-2" placeholder="Snookie is home!" /></label>
          <button className="rounded bg-park px-3 py-2 text-white">Confirm Reunion</button>
        </form>
      ) : <p className="stamp">Reunion confirmed {new Date(reunion.confirmedAt).toLocaleString()}</p>}
    </div>
  );
}
