'use client';

import { useEffect } from 'react';

export function ViewerInit() {
  useEffect(() => {
    const key = 'viewerId';
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, crypto.randomUUID());
    }
  }, []);

  return null;
}
