import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '@/app/models/categories.model';
import { Category } from '@/app/type/categoryType';

export async function getAllCategoriesService(): Promise<Category[]> {
  return getAllCategories();
}

export async function createCategoryService(data: Partial<Category>): Promise<number> {
  if (!data.name?.trim()) throw new Error('Tên danh mục không được để trống');
  return createCategory({ ...data, name: data.name.trim() });
}

export async function updateCategoryService(id: number, data: Partial<Category>): Promise<void> {
  const existing = await getCategoryById(id);
  if (!existing) throw new Error('Danh mục không tồn tại');
  if (!data.name?.trim()) throw new Error('Tên danh mục không được để trống');
  await updateCategory(id, { ...data, name: data.name.trim() });
}

export async function deleteCategoryService(id: number): Promise<void> {
  const existing = await getCategoryById(id);
  if (!existing) throw new Error('Danh mục không tồn tại');
  await deleteCategory(id);
}
