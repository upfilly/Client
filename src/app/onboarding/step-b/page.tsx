'use client'

import React, { Suspense } from 'react';
import WhiteLabelOnboarding from '@/app/white-label-onboarding/page';

export default function StepBPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <img src="/assets/img/loader.gif" alt="Loading..." style={{ width: '60px', height: '60px' }} />
      </div>
    }>
      <WhiteLabelOnboarding initialStep={1} />
    </Suspense>
  );
}

