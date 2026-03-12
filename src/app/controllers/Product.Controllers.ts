import { countProducts } from "@/app/models/product.model";
import {
  getAllProducts,
  getProductById,
  getSortedProducts,
  getProductsPagination,
  
} from "@/app/services/product.service";

export async function fetchAllProductsController() {
  return await getAllProducts();
}

export async function fetchProductControllerByID(id: string) {
  const productId = parseInt(id);

  if (!Number.isInteger(productId)) {
    throw new Error("ID không hợp lệ");
  }
  
  return await getProductById(productId);
}

export async function fetchSortedProductsController(sort: string, page: number = 1) {
  return await getProductsPagination(sort, page);
}


export async function fetchProductsPaginationController(sort: string, page: number) {
  const data = await getProductsPagination(sort, page);
  return data;
}
