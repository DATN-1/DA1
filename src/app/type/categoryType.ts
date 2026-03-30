import { RowDataPacket } from 'mysql2';

export interface Category extends RowDataPacket {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;
}

export type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  image: string;
};
