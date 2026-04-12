import { RowDataPacket } from 'mysql2';

export interface Blog extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  image_url: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  created_at?: string;
};