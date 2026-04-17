import { createGallery, deleteGallery, getAllGalleries, updateGallery } from '../models/gallery.model';
import { GalleryForm } from '../type/GalleryType';

export async function fetchAllGalleriesService(status?: 'active' | 'inactive') {
  return getAllGalleries(status);
}

export async function createGalleryService(data: GalleryForm) {
  if (!data.product_id || Number(data.product_id) <= 0) {
    throw new Error('Ban phai chon san pham cho anh gallery');
  }

  if (!data.image_url) {
    throw new Error('URL hinh anh khong duoc de trong');
  }

  data.product_id = Number(data.product_id);
  data.display_order = Number(data.display_order) || 0;
  data.category = (data.category || 'khac').trim();

  return createGallery(data);
}

export async function updateGalleryService(id: number, data: GalleryForm) {
  if (!data.product_id || Number(data.product_id) <= 0) {
    throw new Error('Ban phai chon san pham cho anh gallery');
  }

  if (!data.image_url) {
    throw new Error('URL hinh anh khong duoc de trong');
  }

  data.product_id = Number(data.product_id);
  data.display_order = Number(data.display_order) || 0;
  data.category = (data.category || 'khac').trim();

  const result = await updateGallery(id, data);
  if (result.affectedRows === 0) {
    throw new Error('Khong tim thay anh gallery de cap nhat');
  }

  return result;
}

export async function deleteGalleryService(id: number) {
  if (!id) {
    throw new Error('ID gallery khong hop le');
  }

  const result = await deleteGallery(id);
  if (result.affectedRows === 0) {
    throw new Error('Khong tim thay anh gallery de xoa');
  }

  return result;
}
