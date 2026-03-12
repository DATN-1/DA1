<<<<<<< HEAD
import { findAllProducts, findProductById } from "@/app/models/product.model";
=======
import { 
  findAllProducts, 
  findProductById, 
  SortProducts, 
  findProductsWithPagination, 
  countProducts 
} from "@/app/models/product.model";
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5

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
<<<<<<< HEAD
=======
}

export async function getSortedProducts(sort: string) {
  const products = await SortProducts(sort);
  return products;
}

export async function getProductsPagination(sort: string, page: number) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Trang không hợp lệ");
  }

  const limit = 9;
  const offset = (page - 1) * limit;

  const products = await findProductsWithPagination(sort, limit, offset);
  const total = await countProducts();

  return {
    products,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit
  };

>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
}