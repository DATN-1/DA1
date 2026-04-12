import { getAllBrandsController, createBrandController, updateBrandController, deleteBrandController } from '@/app/controllers/brand.Controllers';

export async function GET() {
  return getAllBrandsController();
}

export async function POST(req: Request) {
  return createBrandController(req);
}

export async function PUT(req: Request) {
  return updateBrandController(req);
}

export async function DELETE(req: Request) {
  return deleteBrandController(req);
}
