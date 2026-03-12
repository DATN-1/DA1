import { updateOrderStatus } from '@/app/controllers/order.Controllers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  return updateOrderStatus(req, Number(params.id));
}