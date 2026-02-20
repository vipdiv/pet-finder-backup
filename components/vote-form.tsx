'use client';

import { castVote } from '@/app/actions';

export function VoteForm({ targetId, targetType }: { targetId: string; targetType: 'SIGHTING' | 'COMMENT' }) {
  return (
    <button
      className="text-xs underline"
      onClick={async () => {
        const viewerId = localStorage.getItem('viewerId') || 'anon';
        await castVote(targetType, targetId, viewerId, 'UP');
      }}
    >
      Upvote
    </button>
  );
}
