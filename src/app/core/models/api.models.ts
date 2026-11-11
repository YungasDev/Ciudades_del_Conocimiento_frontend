export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  order?: number;
  postCount?: number;
}

export interface PostCategory {
  name: string;
  slug: string;
  color: string | null;
}

export interface PostCover {
  url: string;
  alt: string;
}

export interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  featured: boolean;
  publishedAt: string | null;
  coverMediaId: string | null;
  categoryId: string;
  cover: PostCover | null;
  category: PostCategory | null;
  author: string;
}

export interface PostDetail extends PostSummary {
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  related: PostSummary[];
}

export interface Paginated<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type ActorSector =
  | 'GOBIERNO'
  | 'EDUCACION'
  | 'SECTOR_PRIVADO'
  | 'COMUNIDAD';

export interface Actor {
  id: string;
  name: string;
  slug: string;
  sector: ActorSector;
  description: string;
  websiteUrl: string | null;
  logo: PostCover | null;
  logoMedia?: PostCover | null;
  order: number;
  published?: boolean;
  consent?: boolean;
  consentNote?: string | null;
  contactEmail?: string | null;
  logoMediaId?: string | null;
}

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  alt: string;
  path: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  place: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  published: boolean;
}

export interface EventLists {
  upcoming: EventItem[];
  past: EventItem[];
}

export interface Stats {
  published: number;
  drafts: number;
  archived: number;
  categories: number;
  actorsPublished: number;
  actorsTotal: number;
  upcomingEvents: number;
  unreadMessages: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  mustChangePassword: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  sector: string | null;
  message: string;
  consent: boolean;
  read: boolean;
  createdAt: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  organization?: string;
  sector?: string;
  message: string;
  consent: boolean;
}
