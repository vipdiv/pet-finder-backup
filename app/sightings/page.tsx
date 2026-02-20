import { subHours, subDays, formatDistanceToNow } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { VoteForm } from '@/components/vote-form';
import { ShareButton } from '@/components/share-button';
import { ReportForm } from '@/components/report-form';

export default async function SightingsPage({ searchParams }: { searchParams: { species?: string; range?: string } }) {
  const range = searchParams.range || '24h';
  const since = range === '1h' ? subHours(new Date(), 1) : range === '6h' ? subHours(new Date(), 6) : range === '7d' ? subDays(new Date(), 7) : subHours(new Date(), 24);
  const sightings = await prisma.sighting.findMany({
    where: {
      hidden: false,
      seenAt: { gte: since },
      ...(searchParams.species ? { species: searchParams.species as any } : {})
    },
    orderBy: { seenAt: 'desc' }
  });

  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-park">Sightings Feed</h1>
      <div className="frame-card text-sm">Filters via query: ?species=DOG&range=6h (1h/6h/24h/7d)</div>
      {sightings.map((s) => (
        <article key={s.id} id={s.id} className="frame-card">
          <img src={s.photoUrl} className="h-48 w-full rounded object-cover" alt="sighting" />
          <p className="mt-2 text-sm">Seen {formatDistanceToNow(s.seenAt)} ago</p>
          <p className="text-sm">{s.locationText}</p>
          {s.notes ? <p className="text-sm text-stone-700">{s.notes}</p> : null}
          {s.waitMinutes ? <p className="text-sm text-sepia">Waiting until {new Date(s.seenAt.getTime() + s.waitMinutes * 60000).toLocaleTimeString()}</p> : null}
          <div className="mt-2 flex gap-3"><VoteForm targetId={s.id} targetType="SIGHTING" /><ShareButton id={s.id} /></div>
          <ReportForm targetType="SIGHTING" targetId={s.id} />
        </article>
      ))}
    </div>
  );
}
