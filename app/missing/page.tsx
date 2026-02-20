import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function MissingPage() {
  const pets = await prisma.pet.findMany({ where: { status: 'MISSING', hidden: false }, orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-park">Missing Pets</h1>
        <Link href="/missing/new" className="rounded bg-park px-3 py-2 text-white">Report a Missing Pet</Link>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {pets.map((pet) => (
          <article className="frame-card" key={pet.id}>
            <img src={pet.primaryPhotoUrl} alt={pet.name ?? 'pet'} className="h-44 w-full rounded object-cover" />
            <h2 className="mt-2 font-serif text-xl">{pet.name || 'Unnamed'}</h2>
            <p className="text-sm">{pet.description}</p>
            <p className="mt-1 text-sm font-semibold text-stamp">Contact: {pet.contactInfo}</p>
            <Link href={`/pets/${pet.id}`} className="mt-2 inline-block text-sm underline">Open thread</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
