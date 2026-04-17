import {
  fetchAllGalleriesController,
  createGalleryController,
  updateGalleryController,
  deleteGalleryController,
} from '@/app/controllers/gallery.Controllers';

export async function GET(req: Request) {
  return fetchAllGalleriesController(req);
}

export async function POST(req: Request) {
  return createGalleryController(req);
}

export async function PUT(req: Request) {
  return updateGalleryController(req);
}

export async function DELETE(req: Request) {
  return deleteGalleryController(req);
}
