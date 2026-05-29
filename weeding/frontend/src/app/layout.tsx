import type { Metadata } from 'next';
import '../styles/globals.css';
import QueryProvider from '../components/QueryProvider';
import AuthInit from '../components/AuthInit';

export const metadata: Metadata = {
  title: 'MBNP Invite - Digital Invitation SaaS',
  description: 'Create elegant, premium, and fully-customizable digital wedding invitations in minutes. Share your story beautifully.',
  keywords: 'digital invitation, wedding invitation, SaaS, e-invitation, undangan digital, website undangan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased min-h-screen text-slate-900 bg-slate-50">
        <QueryProvider>
          <AuthInit>
            {children}
          </AuthInit>
        </QueryProvider>
      </body>
    </html>
  );
}
