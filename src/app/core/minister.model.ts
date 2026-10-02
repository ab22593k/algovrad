export type MinisterCategory =
  'premier' | 'ministre-etat' | 'ministre' | 'ministre-delegue' | 'secretaire-etat' | 'wali';

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

export type RadarKind =
  | 'decret'
  | 'communique'
  | 'appel-offre'
  | 'conseil-ministres'
  | 'nomination'
  /** Provisional award published (contract about to be signed). */
  | 'attribution'
  /** Tender failed (no valid bid) — usually followed by a re-tender. */
  | 'infructuosite'
  /** Award cancelled — the contract is released back to market. */
  | 'annulation'
  /** Formal notice served on a failing contractor. */
  | 'mise-en-demeure'
  /** Deadline extended — the bid window is still open. */
  | 'prorogation';

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
  /**
   * Business signal for enterprises: the tender failed, was cancelled, or its
   * deadline was extended — i.e. the opportunity is live again.
   */
  opportunity?: boolean;
  /** ANEP / BO reference number when the notice carries one. */
  ref?: string;
  /** Procuring entity (client) for tender notices. */
  client?: string;
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
