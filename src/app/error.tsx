'use client'

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '20px' }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>Something went wrong!</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>An error occurred while loading this page.</p>
      <button
        onClick={() => reset()}
        style={{ padding: '10px 20px', backgroundColor: '#1c306d', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
      >
        Try again
      </button>
    </div>
  );
}

