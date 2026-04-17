import { 
  findAllProducts, 
  findAvailableProductCategories,
  findProductById, 
  SortProducts, 
  findProductsWithPagination, 
  countProducts,
  createProduct,
  updateProductById,
  deleteProductById,
} from "@/app/models/product.model";

export async function getAllProducts() {
  return await findAllProducts();
}

export async function getAvailableProductCategories() {
  return await findAvailableProductCategories();
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

export async function getProductsPagination(
  sort: string,
  page: number,
  search: string = "",
  categoryIds: number[] = [],
  priceRanges: string[] = [],
  minimumRating: number = 0
) {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Trang không hợp lệ");
  }

  const limit = 9;
  const offset = (page - 1) * limit;
  const filters = {
    search,
    categoryIds,
    priceRanges,
    minimumRating,
  };

  const [products, total, categories] = await Promise.all([
    findProductsWithPagination(filters, sort, limit, offset),
    countProducts(filters),
    findAvailableProductCategories(),
  ]);

  return {
    products,
    categories,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit
  };

}

type AdminProductPayload = {
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number | null;
  brand_id: number | null;
  description: string | null;
  status: "active" | "draft" | "archived";
};

function validateAdminProductPayload(payload: AdminProductPayload) {
  if (!payload.name?.trim()) {
    throw new Error("Tên sản phẩm không được để trống");
  }
  if (!Number.isFinite(payload.price) || payload.price < 0) {
    throw new Error("Giá sản phẩm không hợp lệ");
  }
  if (!Number.isInteger(payload.stock) || payload.stock < 0) {
    throw new Error("Tồn kho không hợp lệ");
  }
  if (!payload.image_url?.trim()) {
    throw new Error("Ảnh sản phẩm không được để trống");
  }
}

export async function createAdminProduct(payload: AdminProductPayload) {
  validateAdminProductPayload(payload);
  return await createProduct({ ...payload, image: payload.image_url });
}

export async function updateAdminProduct(id: number, payload: AdminProductPayload) {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("ID không hợp lệ");
  }
  validateAdminProductPayload(payload);
  return await updateProductById(id, { ...payload, image: payload.image_url });
}

export async function deleteAdminProduct(id: number) {
  if (!Number.isInteger(id) || id < 1) {
    throw new Error("ID không hợp lệ");
  }
  return await deleteProductById(id);
}