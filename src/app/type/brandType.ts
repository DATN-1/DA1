import { RowDataPacket } from 'mysql2';

export interface Brand extends RowDataPacket {
  id: number;
  name: string;
  logo_url: string | null;
}

export type BrandForm = {
  name: string;
  logo_url: string;
};
