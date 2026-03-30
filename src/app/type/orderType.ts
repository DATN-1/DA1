import { RowDataPacket } from 'mysql2';


export interface Order extends RowDataPacket {
  id: number;
  user_id: number | null;
  order_code: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  shipping_fee: number;
  total_amount: number;
  status: string;
  payment_status?: string;
  payment_method: string; 
  notes: string | null;
  created_at: string;
}