'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { BadgeType, PetStatus, VoteTargetType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/upload';
import { DEFAULT_NEIGHBORHOOD } from '@/lib/constants';
import { awardEvent, maybeAwardBadge } from '@/lib/gamification';
import { checkRateLimit } from '@/lib/rate-limit';

function getRateKey(viewerId: string) {
  const ip = headers().get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  return `${ip}:${viewerId}`;
}

export async function createSighting(formData: FormData) {
  const viewerId = String(formData.get('viewerId') || 'anon');
  if (!checkRateLimit(getRateKey(viewerId))) throw new Error('Rate limited. Please try again shortly.');

  const file = formData.get('photo') as File;
  const photoUrl = await uploadImage(file);
  const sighting = await prisma.sighting.create({
    data: {
      species: formData.get('species') as any,
      photoUrl,
      locationText: String(formData.get('locationText') || ''),
      seenAt: new Date(String(formData.get('seenAt') || new Date().toISOString())),
      notes: String(formData.get('notes') || '') || null,
      waitMinutes: formData.get('waitMinutes') ? Number(formData.get('waitMinutes')) : null,
      createdByViewerId: viewerId,
      petId: String(formData.get('petId') || '') || null
    }
  });

  await awardEvent(viewerId, 'POST_SIGHTING');

  const allSightings = await prisma.sighting.findMany({ where: { createdByViewerId: viewerId }, select: { seenAt: true } });
  const morningCount = allSightings.filter((s) => { const h = s.seenAt.getHours(); return h >= 6 && h < 9; }).length;
  const eveningCount = allSightings.filter((s) => { const h = s.seenAt.getHours(); return h >= 18 && h < 22; }).length;
  if (morningCount >= 3) await maybeAwardBadge(viewerId, BadgeType.EARLY_WALKER);
  if (eveningCount >= 3) await maybeAwardBadge(viewerId, BadgeType.EVENING_PATROL);

  revalidatePath('/');
  revalidatePath('/sightings');
  return sighting.id;
}

export async function linkSightingToPet(sightingId: string, petId: string, viewerId: string) {
  await prisma.sighting.update({ where: { id: sightingId }, data: { petId } });
  await awardEvent(viewerId, 'LINK_SIGHTING_TO_MISSING');

  const regularLinks = await prisma.sighting.count({ where: { createdByViewerId: viewerId, pet: { status: 'REGULAR' } } });
  if (regularLinks >= 3) await maybeAwardBadge(viewerId, BadgeType.LOCAL_KNOWLEDGE);

  revalidatePath(`/pets/${petId}`);
}

export async function createMissingPet(formData: FormData) {
  const file = formData.get('photo') as File;
  const photoUrl = await uploadImage(file);

  await prisma.pet.create({
    data: {
      status: 'MISSING',
      species: formData.get('species') as any,
      name: String(formData.get('name') || '') || null,
      description: String(formData.get('description') || '') || null,
      contactInfo: String(formData.get('contactInfo') || ''),
      neighborhood: DEFAULT_NEIGHBORHOOD,
      primaryPhotoUrl: photoUrl
    }
  });

  revalidatePath('/missing');
}

export async function addComment(formData: FormData) {
  const viewerId = String(formData.get('viewerId') || 'anon');
  const petId = String(formData.get('petId'));
  const sightingId = String(formData.get('sightingId') || '') || null;
  const body = String(formData.get('body') || '');
  await prisma.comment.create({ data: { petId, sightingId, body, createdByViewerId: viewerId } });
  await awardEvent(viewerId, 'POST_COMMENT');

  const lower = body.toLowerCase();
  const count = await prisma.comment.count({
    where: {
      createdByViewerId: viewerId,
      OR: [{ body: { contains: 'regular' } }, { body: { contains: 'known' } }, { body: { contains: 'friendly' } }]
    }
  });
  if (lower.includes('regular') || lower.includes('known') || lower.includes('friendly')) {
    if (count >= 3) await maybeAwardBadge(viewerId, BadgeType.STEADY_NEIGHBOR);
  }

  if (sightingId) {
    const sighting = await prisma.sighting.findUnique({ where: { id: sightingId } });
    if (sighting?.waitMinutes) {
      const expiresAt = new Date(sighting.seenAt.getTime() + sighting.waitMinutes * 60000);
      if (Date.now() < expiresAt.getTime()) await maybeAwardBadge(viewerId, BadgeType.QUICK_RESPONSE);
    }
  }

  revalidatePath(`/pets/${petId}`);
}

export async function castVote(targetType: VoteTargetType, targetId: string, viewerId: string, voteType: 'UP' | 'DOWN' = 'UP') {
  await prisma.vote.upsert({
    where: { targetType_targetId_createdByViewerId: { targetType, targetId, createdByViewerId: viewerId } },
    update: { voteType },
    create: { targetType, targetId, createdByViewerId: viewerId, voteType }
  });

  if (voteType === 'UP') {
    const target = targetType === 'COMMENT'
      ? await prisma.comment.findUnique({ where: { id: targetId } })
      : await prisma.sighting.findUnique({ where: { id: targetId } });

    if (target) await awardEvent(target.createdByViewerId, 'UPVOTE_HELPFUL');
  }

  revalidatePath('/sightings');
}

export async function submitReport(formData: FormData) {
  const viewerId = String(formData.get('viewerId') || 'anon');
  const targetType = formData.get('targetType') as any;
  const targetId = String(formData.get('targetId'));
  const reason = String(formData.get('reason') || 'Needs moderator review');
  await prisma.report.create({ data: { targetType, targetId, reason, createdByViewerId: viewerId } });

  const count = await prisma.report.count({ where: { targetType, targetId } });
  if (count >= 3) {
    if (targetType === 'PET') await prisma.pet.update({ where: { id: targetId }, data: { hidden: true } });
    if (targetType === 'SIGHTING') await prisma.sighting.update({ where: { id: targetId }, data: { hidden: true } });
    if (targetType === 'COMMENT') await prisma.comment.update({ where: { id: targetId }, data: { hidden: true } });
    await awardEvent(viewerId, 'REPORT_SPAM_OR_ABUSE');
  }

  revalidatePath('/');
}

export async function confirmReunion(formData: FormData) {
  const petId = String(formData.get('petId'));
  const viewerId = String(formData.get('viewerId') || 'anon');
  const note = String(formData.get('note') || '');

  await prisma.reunion.create({
    data: {
      petId,
      confirmedAt: new Date(),
      confirmedByViewerId: viewerId,
      note: note || null
    }
  });

  await awardEvent(viewerId, 'CONFIRMED_REUNION');
  await prisma.pet.update({ where: { id: petId }, data: { status: PetStatus.UNKNOWN } });

  const contributors = await prisma.$queryRaw<Array<{ viewerId: string }>>`
    SELECT DISTINCT createdByViewerId as viewerId FROM Sighting WHERE petId = ${petId}
    UNION
    SELECT DISTINCT createdByViewerId as viewerId FROM Comment WHERE petId = ${petId}
    LIMIT 5
  `;

  for (const c of contributors) {
    await awardEvent(c.viewerId, 'CONFIRMED_REUNION', 5);
    await maybeAwardBadge(c.viewerId, BadgeType.REUNION_HELPER);
  }

  revalidatePath(`/pets/${petId}`);
}
