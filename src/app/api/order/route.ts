import { updateOrderStatus, getAllOrdersController, createOrderController } from '@/app/controllers/order.Controllers';

export async function POST(req: Request) {
  return createOrderController(req);
}
export async function PATCH(req: Request) {
  return updateOrderStatus(req);
}

export async function GET() {
  return getAllOrdersController();
}