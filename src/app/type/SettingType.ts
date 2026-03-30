import { RowDataPacket } from 'mysql2';

export interface SettingItem extends RowDataPacket {
  id: number;
  key_name: string;
  value: string | null;
}

export type SettingMap = Record<string, string>;
