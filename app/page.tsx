import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { AboutModal } from '@/components/about-modal';
import { GardenPanel } from '@/components/garden-panel';

export default async function HomePage() {
  const [latestSightings, reunionCount, regularCount] = await Promise.all([
    prisma.sighting.findMany({ where: { hidden: false }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.reunion.count(),
    prisma.pet.count({ where: { status: 'REGULAR' } })
  ]);

  return (
    <div className="space-y-6">
      <section className="frame-card">
        <h1 className="font-serif text-4xl text-park">Lawndale Park Pet Registry</h1>
        <p className="mt-2 text-sepia">Seen here. Safe here. Found faster.</p>
        <p className="mt-2 text-sm">A neighborly board for sightings, missing pets, and familiar park regulars.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/sightings/new" className="rounded bg-park px-4 py-3 text-white">Post a Sighting</Link>
          <Link href="/missing" className="rounded border border-park px-4 py-3 text-park">View Missing Pets</Link>
        </div>
        <div className="mt-3"><AboutModal /></div>
      </section>

      <GardenPanel reunionCount={reunionCount} regularCount={regularCount} />

      <section className="space-y-3">
        <h2 className="font-serif text-2xl text-park">Latest Sightings</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {latestSightings.map((s) => (
            <article key={s.id} className="frame-card">
              <img src={s.photoUrl} alt="Sighting" className="h-40 w-full rounded object-cover" />
              <p className="mt-2 text-sm">{s.locationText}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
