import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.badge.deleteMany();
  await prisma.gamificationEvent.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.report.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.sighting.deleteMany();
  await prisma.reunion.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.viewerProfile.deleteMany();

  const missingPets = await Promise.all(
    ['Milo', 'Pepper', 'Junie', 'Blue', 'Churro', 'Nala'].map((name, i) =>
      prisma.pet.create({
        data: {
          status: 'MISSING',
          name,
          species: i % 2 === 0 ? 'DOG' : 'CAT',
          description: `Last seen near Lawndale Park ${['bridge', 'pavilion', 'tennis courts'][i % 3]}.`,
          neighborhood: 'Houston — Lawndale Park',
          primaryPhotoUrl: `https://picsum.photos/seed/missing-${i}/800/600`,
          contactInfo: '(713) 555-01' + String(i).padStart(2, '0')
        }
      })
    )
  );

  const regularPets = await Promise.all(
    ['Ranger', 'Mochi', 'Dot', 'Scout', 'Sunny', 'Patches'].map((name, i) =>
      prisma.pet.create({
        data: {
          status: 'REGULAR',
          name,
          species: i % 2 === 0 ? 'DOG' : 'CAT',
          description: `Known regular often strolling near the ${['trail bend', 'pavilion', 'west gate'][i % 3]}.`,
          neighborhood: 'Houston — Lawndale Park',
          primaryPhotoUrl: `https://picsum.photos/seed/regular-${i}/800/600`
        }
      })
    )
  );

  const pets = [...missingPets, ...regularPets];
  const locs = ['under the bridge by tennis court', 'near the pavilion picnic tables', 'east trail entrance', 'south bridge ramp', 'behind little league field'];
  for (let i = 0; i < 12; i++) {
    const viewer = `viewer-${(i % 4) + 1}`;
    const sighting = await prisma.sighting.create({
      data: {
        petId: pets[i % pets.length].id,
        species: i % 2 === 0 ? 'DOG' : 'CAT',
        photoUrl: `https://picsum.photos/seed/sighting-${i}/800/600`,
        locationText: locs[i % locs.length],
        seenAt: new Date(Date.now() - i * 3600_000),
        notes: i % 3 === 0 ? 'Calm and friendly, trotting along the path.' : null,
        waitMinutes: i % 4 === 0 ? 20 : null,
        createdByViewerId: viewer
      }
    });

    await prisma.comment.create({
      data: {
        petId: pets[i % pets.length].id,
        sightingId: sighting.id,
        body: i % 2 === 0 ? 'This one is a regular near the pavilion.' : 'Seen moving toward the trail; staying nearby for a few minutes.',
        createdByViewerId: `viewer-${(i % 5) + 1}`
      }
    });

    if (i % 2 === 0) {
      await prisma.vote.create({
        data: {
          targetType: 'SIGHTING',
          targetId: sighting.id,
          voteType: 'UP',
          createdByViewerId: `viewer-${(i % 5) + 8}`
        }
      });
    }
  }
}

main().finally(() => prisma.$disconnect());
