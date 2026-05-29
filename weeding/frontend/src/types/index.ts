export interface GalleryItem {
  id: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
}

export interface StoryItem {
  id: string;
  date: string;
  title: string;
  content: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface RSVPItem {
  id: string;
  name: string;
  attendance: boolean;
  guestCount: number;
  message?: string;
  createdAt: string;
}

export interface GuestItem {
  id: string;
  name: string;
  code: string;
  address?: string;
  isSent: boolean;
  isAttended: boolean;
  qrToken?: string;
}

export interface InvitationSection {
  id: string;
  sectionName: string;
  isEnabled: boolean;
}

export interface ThemeSettings {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  animationStyle: string;
  backgroundStyle: string;
}

export interface AnalyticsItem {
  id: string;
  device?: string;
  browser?: string;
  ipAddress?: string;
  city?: string;
  country?: string;
  referrer?: string;
  duration?: number;
  createdAt: string;
}

export interface InvitationData {
  id: string;
  subdomain: string;
  title: string;
  weddingDate: string;
  themeColor: string;
  welcomeText: string;
  address: string;
  mapUrl?: string;
  musicUrl?: string;
  coverImage?: string;
  templateCode: string;
  isPublished: boolean;
  isPremium: boolean;
  galleries?: GalleryItem[];
  stories?: StoryItem[];
  rsvps?: RSVPItem[];
  guests?: GuestItem[];
  sections?: InvitationSection[];
  themeSettings?: ThemeSettings;
  analytics?: AnalyticsItem[];
}

export interface TemplateProps {
  data: InvitationData;
  guestName?: string;
  onSubmitRSVP: (rsvp: { name: string; attendance: boolean; guestCount: number; message: string }) => Promise<void>;
  isSubmittingRSVP: boolean;
}
