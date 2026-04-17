import { RowDataPacket } from 'mysql2';

export interface Gallery extends RowDataPacket {
  id: number;
  product_id: number | null;
  product_name?: string | null;
  image_url: string;
  title: string | null;
  category: string;
  display_order: number;
  status: 'active' | 'inactive';
  created_at?: string;
}

export type GalleryForm = {
  product_id: number | null;
  image_url: string;
  title: string | null;
  category: string;
  display_order: number;
  status: 'active' | 'inactive';
};
