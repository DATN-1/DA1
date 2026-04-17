import { NextResponse } from 'next/server';
import {
  fetchAllGalleriesService,
  createGalleryService,
  updateGalleryService,
  deleteGalleryService,
} from '../services/gallery.Service';

export async function fetchAllGalleriesController(req: Request) {
  try {
    const url = new URL(req.url);
    const statusParam = url.searchParams.get('status');
    const status = statusParam === 'active' || statusParam === 'inactive' ? statusParam : undefined;

    const galleries = await fetchAllGalleriesService(status);
    return NextResponse.json(galleries);
  } catch (error: any) {
    console.error('[Gallery Controller GET]', error);
    return NextResponse.json({ error: error.message || 'Loi lay gallery' }, { status: 500 });
  }
}

export async function createGalleryController(req: Request) {
  try {
    const data = await req.json();
    await createGalleryService(data);
    return NextResponse.json({ message: 'Them anh gallery thanh cong' }, { status: 201 });
  } catch (error: any) {
    console.error('[Gallery Controller POST]', error);
    return NextResponse.json({ error: error.message || 'Loi them gallery' }, { status: 400 });
  }
}

export async function updateGalleryController(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'Thieu ID gallery' }, { status: 400 });
    }

    await updateGalleryService(id, updateData);
    return NextResponse.json({ message: 'Cap nhat gallery thanh cong' }, { status: 200 });
  } catch (error: any) {
    console.error('[Gallery Controller PUT]', error);
    return NextResponse.json({ error: error.message || 'Loi cap nhat gallery' }, { status: 400 });
  }
}

export async function deleteGalleryController(req: Request) {
  try {
    const data = await req.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: 'Thieu ID gallery' }, { status: 400 });
    }

    await deleteGalleryService(id);
    return NextResponse.json({ message: 'Xoa anh gallery thanh cong' }, { status: 200 });
  } catch (error: any) {
    console.error('[Gallery Controller DELETE]', error);
    return NextResponse.json({ error: error.message || 'Loi xoa gallery' }, { status: 400 });
  }
}
