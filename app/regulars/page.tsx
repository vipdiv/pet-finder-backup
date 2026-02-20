import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function RegularsPage() {
  const pets = await prisma.pet.findMany({ where: { status: 'REGULAR', hidden: false }, orderBy: { createdAt: 'desc' } });
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-park">Park Regulars</h1>
      <p className="text-sm">Some pets are familiar faces in the park. This helps people avoid panic while still sharing updates.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {pets.map((pet) => (
          <article className="frame-card" key={pet.id}>
            <img src={pet.primaryPhotoUrl} className="h-44 w-full rounded object-cover" alt={pet.name ?? 'regular'} />
            <h2 className="mt-2 font-serif text-xl">{pet.name || 'Unnamed'}</h2>
            <p className="text-sm">{pet.description}</p>
            <Link href={`/pets/${pet.id}`} className="text-sm underline">Open profile</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
