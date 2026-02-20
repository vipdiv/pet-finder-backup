import { submitReport } from '@/app/actions';
import { ViewerField } from './viewer-field';

export function ReportForm({ targetType, targetId }: { targetType: 'PET' | 'SIGHTING' | 'COMMENT'; targetId: string }) {
  return (
    <form action={submitReport} className="mt-2 flex items-center gap-2">
      <ViewerField />
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <input type="hidden" name="reason" value="Community report" />
      <button className="text-xs text-stamp underline">Report</button>
    </form>
  );
}
