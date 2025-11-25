export interface Source {
  title: string;
  uri: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  timestamp: string;
  fullDate?: string;
  category: string;
  impactLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  sources?: Source[];
}

export interface NewsResponse {
  items: NewsItem[];
}