import { BadgeType, GamificationEventType, StewardLevel } from '@prisma/client';
import { prisma } from './prisma';

export const pointsByEvent: Record<GamificationEventType, number> = {
  POST_SIGHTING: 2,
  POST_COMMENT: 1,
  UPVOTE_HELPFUL: 2,
  LINK_SIGHTING_TO_MISSING: 5,
  CONFIRMED_REUNION: 10,
  REPORT_SPAM_OR_ABUSE: 2
};

export function pointsToLevel(points: number): StewardLevel {
  if (points >= 150) return 'BRIDGE_GUARDIAN';
  if (points >= 70) return 'STEWARD';
  if (points >= 30) return 'PARK_WATCHER';
  if (points >= 10) return 'NEIGHBOR';
  return 'VISITOR';
}

export async function awardEvent(viewerId: string, type: GamificationEventType, points = pointsByEvent[type]) {
  await prisma.gamificationEvent.create({ data: { viewerId, type, points } });

  const profile = await prisma.viewerProfile.upsert({
    where: { viewerId },
    create: { viewerId, points, stewardLevel: pointsToLevel(points) },
    update: { points: { increment: points } }
  });

  const nextPoints = profile.points;
  await prisma.viewerProfile.update({
    where: { viewerId },
    data: { stewardLevel: pointsToLevel(nextPoints) }
  });
}

export async function maybeAwardBadge(viewerId: string, type: BadgeType) {
  await prisma.badge.upsert({
    where: { viewerId_type: { viewerId, type } },
    update: {},
    create: { viewerId, type }
  });
}
