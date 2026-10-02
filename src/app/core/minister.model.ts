export type MinisterCategory =
  | 'premier'
  | 'ministre-etat'
  | 'ministre'
  | 'ministre-delegue'
  | 'secretaire-etat'
  | 'wali';

export interface Minister {
  id: string;
  name: string;
  roleFr: string;
  category: MinisterCategory;
  ministryUrl?: string;
  isNew?: boolean;
  statusNote?: string;
  /** ISO date (YYYY-MM-DD) of nomination — decree 25-241 = 2025-09-14 for seed. */
  appointedAt: string;
  decree?: string;
}

export type RadarKind = 'decret' | 'communique' | 'appel-offre' | 'conseil-ministres' | 'nomination';

export interface RadarItem {
  id: string;
  kind: RadarKind;
  titleFr: string;
  titleAr?: string;
  summaryFr: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  isNew?: boolean;
  tags: string[];
}

export interface OfficialSource {
  id: string;
  label: string;
  labelAr?: string;
  labelEn?: string;
  url: string;
  kind: string;
  /** What this portal publishes (FR base). */
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  /** What the radar watches on this source. */
  watch: string;
  watchAr?: string;
  watchEn?: string;
  /** Update rhythm, verified where possible. */
  frequency: string;
  frequencyAr?: string;
  frequencyEn?: string;
  /** Deep pages to check first. */
  keyPages?: string[];
  languages?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  at: string;
}
