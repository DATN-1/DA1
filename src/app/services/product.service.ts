import { findAllProducts, findProductById, SortProducts } from "@/app/models/product.model";

export async function getAllProducts() {
  return await findAllProducts();
}

export async function getProductById(id: number) {
    if(!Number.isFinite(id)) {
        throw new Error("ID không hợp lệ");
    }
    
  const product = await findProductById(id.toString());

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function getSortedProducts(sort: string) {
  const products = await SortProducts(sort);
  return products;
}