export interface HouseDesign {
  id: string;
  slug: string;
  usableArea?: string;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  category: string;
  categories: string[];
  title: string;
  excerpt: string;
  description: string;
  whoItsFor: string;
  story: string;
  concept: string;
  palette: string;
  coverImage: string;
  coverAlt: string;
  gallery: string[];
  highlights: string[];
  tags: string[];
}
