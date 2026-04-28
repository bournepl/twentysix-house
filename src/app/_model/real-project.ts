export interface RealProjectSpec {
  label: string;
  value: string;
}

export interface RealProject {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  category: string;
  categories: string[];
  location: string;
  year: string;
  scope: string;
  status: string;
  landSize?: string;
  usableArea?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  coverImage: string;
  coverAlt: string;
  gallery: string[];
  highlights: string[];
  specs: RealProjectSpec[];
  tags: string[];
}
