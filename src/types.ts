export type PlatformId = 
  | 'all'
  | 'youtube' 
  | 'tiktok' 
  | 'instagram' 
  | 'twitter' 
  | 'facebook' 
  | 'reddit' 
  | 'vimeo';

export interface FormatOption {
  format_id: string;
  ext: string;
  resolution: string;
  filesize_bytes?: number;
  filesize_str: string;
  format_note?: string;
  vcodec?: string;
  acodec?: string;
  is_audio_only: boolean;
  quality_label: string;
  has_audio: boolean;
}

export interface MediaInfo {
  id: string;
  title: string;
  webpage_url: string;
  thumbnail?: string;
  duration_seconds?: number;
  duration_formatted: string;
  uploader?: string;
  platform: string;
  formats: FormatOption[];
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  slug: string;
  domain: string;
  accentColor: string;
  badgeBg: string;
  sampleUrl: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  steps: { title: string; desc: string }[];
  features: string[];
}
