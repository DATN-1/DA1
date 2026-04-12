import { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand } from '@/app/models/brand.model';
import { Brand } from '@/app/type/brandType';

export async function getAllBrandsService(): Promise<Brand[]> {
  return getAllBrands();
}

export async function createBrandService(name: string, logo_url: string | null): Promise<number> {
  return createBrand(name.trim(), logo_url?.trim() || null);
}

export async function updateBrandService(id: number, name: string, logo_url: string | null): Promise<void> {
  const existing = await getBrandById(id);
  if (!existing) throw new Error('Thương hiệu không tồn tại');
  await updateBrand(id, name.trim(), logo_url?.trim() || null);
}

export async function deleteBrandService(id: number): Promise<void> {
  const existing = await getBrandById(id);
  if (!existing) throw new Error('Thương hiệu không tồn tại');
  await deleteBrand(id);
}
