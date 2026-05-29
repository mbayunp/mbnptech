'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import DynamicTemplateLoader from '../../../components/DynamicTemplateLoader';
import { InvitationData } from '../../../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function SubdomainInvitationPage({ params }: { params: { subdomain: string } }) {
  const searchParams = useSearchParams();
  
  // Safely parse and decode query parameters
  const rawGuestName = searchParams.get('to') || '';
  let guestName: string | undefined = undefined;
  try {
    guestName = rawGuestName ? decodeURIComponent(rawGuestName) : undefined;
  } catch (e) {
    guestName = rawGuestName || undefined; // fallback
  }

  const subdomain = params.subdomain;

  // Fetch invitation data from subdomain endpoint
  const { data, isLoading, error } = useQuery<InvitationData>({
    queryKey: ['invitation', subdomain],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/invitations/subdomain/${subdomain}`);
      return response.data.data.invitation;
    },
  });

  // RSVP submission mutation
  const rsvpMutation = useMutation({
    mutationFn: async (rsvpData: { name: string; attendance: boolean; guestCount: number; message: string }) => {
      const response = await axios.post(`${API_URL}/rsvp`, {
        invitationId: data?.id,
        ...rsvpData,
      });
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-violet-600 animate-spin" />
        <span className="text-sm font-medium text-slate-500 mt-4">Memuat undangan...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="text-lg text-slate-600 mt-2 font-medium">Undangan tidak ditemukan</p>
        <p className="text-sm text-slate-400 max-w-sm mt-1 leading-relaxed">
          Mohon periksa kembali link subdomain yang Anda akses atau hubungi pihak pengundang.
        </p>
      </div>
    );
  }

  // Define dynamic CSS variables based on user theme settings
  const primary = data.themeSettings?.primaryColor || data.themeColor || '#4f46e5';
  const secondary = data.themeSettings?.secondaryColor || '#ec4899';
  const fontFam = data.themeSettings?.fontFamily === 'serif' ? 'var(--font-serif)' : 'var(--font-sans)';

  const templateProps = {
    data,
    guestName,
    onSubmitRSVP: async (rsvp: any) => {
      await rsvpMutation.mutateAsync(rsvp);
    },
    isSubmittingRSVP: rsvpMutation.isPending,
  };

  return (
    <>
      {/* Inject custom variables into theme global scope */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-color: ${primary};
          --secondary-color: ${secondary};
          --font-family-custom: ${fontFam};
        }
        body {
          font-family: var(--font-family-custom), sans-serif !important;
        }
      `}} />
      
      <DynamicTemplateLoader
        templateCode={data.templateCode}
        {...templateProps}
      />
    </>
  );
}

export default function SubdomainInvitationPageWrapper({ params }: { params: { subdomain: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-gold-500 animate-spin" />
        <span className="text-sm font-medium text-slate-400 mt-4">Memuat undangan...</span>
      </div>
    }>
      <SubdomainInvitationPage params={params} />
    </Suspense>
  );
}
