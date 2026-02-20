'use client';

import { useEffect, useRef } from 'react';

export function ViewerField() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.value = localStorage.getItem('viewerId') || 'anon';
    }
  }, []);

  return <input ref={ref} type="hidden" name="viewerId" defaultValue="anon" />;
}
