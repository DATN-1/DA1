import { RowDataPacket } from 'mysql2';

export interface Banner extends RowDataPacket {
  id: number;
  image_url: string;
  title: string | null;
  link_to: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  created_at?: string;
}

export type BannerForm = Omit<Banner, 'id' | 'created_at'>;
