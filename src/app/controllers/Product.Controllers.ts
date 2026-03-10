
import {
  getAllProducts,
  getProductById,
  getSortedProducts
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

export async function fetchSortedProductsController(sort: string) {
  const products = await getSortedProducts(sort);
  return products;
}