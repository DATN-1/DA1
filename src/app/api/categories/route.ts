import { getAllCategoriesController, createCategoryController, updateCategoryController, deleteCategoryController } from '@/app/controllers/category.Controllers';

export async function GET() {
  return getAllCategoriesController();
}

export async function POST(req: Request) {
  return createCategoryController(req);
}

export async function PUT(req: Request) {
  return updateCategoryController(req);
}

export async function DELETE(req: Request) {
  return deleteCategoryController(req);
}
