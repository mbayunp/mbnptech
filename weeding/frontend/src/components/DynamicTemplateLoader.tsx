'use client';

import React, { lazy, Suspense } from 'react';
import { TemplateProps } from '../types';

// Lazy load each template to achieve code-splitting
const RomanticTemplate = lazy(() => import('../templates/romantic'));
const IslamiTemplate = lazy(() => import('../templates/islami'));
const LuxuryTemplate = lazy(() => import('../templates/luxury'));
const MinimalTemplate = lazy(() => import('../templates/minimal'));

interface DynamicTemplateLoaderProps extends TemplateProps {
  templateCode: string;
}

export default function DynamicTemplateLoader({
  templateCode,
  data,
  guestName,
  onSubmitRSVP,
  isSubmittingRSVP,
}: DynamicTemplateLoaderProps) {
  const renderTemplate = () => {
    switch (templateCode) {
      case 'romantic':
        return <RomanticTemplate data={data} guestName={guestName} onSubmitRSVP={onSubmitRSVP} isSubmittingRSVP={isSubmittingRSVP} />;
      case 'islami':
        return <IslamiTemplate data={data} guestName={guestName} onSubmitRSVP={onSubmitRSVP} isSubmittingRSVP={isSubmittingRSVP} />;
      case 'luxury':
        return <LuxuryTemplate data={data} guestName={guestName} onSubmitRSVP={onSubmitRSVP} isSubmittingRSVP={isSubmittingRSVP} />;
      case 'minimal':
        return <MinimalTemplate data={data} guestName={guestName} onSubmitRSVP={onSubmitRSVP} isSubmittingRSVP={isSubmittingRSVP} />;
      default:
        return <RomanticTemplate data={data} guestName={guestName} onSubmitRSVP={onSubmitRSVP} isSubmittingRSVP={isSubmittingRSVP} />;
    }
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-violet-600 animate-spin" />
          <span className="text-sm font-medium text-slate-500 mt-4">Memuat tampilan tema...</span>
        </div>
      }
    >
      {renderTemplate()}
    </Suspense>
  );
}
