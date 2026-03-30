import {
  getAllProducts,
  getProductById,
  getSortedProducts,
  getProductsPagination,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
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

export async function fetchSortedProductsController(
  sort: string,
  page: number = 1,
  search: string = "",
  categoryIds: number[] = [],
  priceRanges: string[] = [],
  minimumRating: number = 0
) {
  return await getProductsPagination(sort, page, search, categoryIds, priceRanges, minimumRating);
}


export async function fetchProductsPaginationController(
  sort: string,
  page: number,
  search: string = "",
  categoryIds: number[] = [],
  priceRanges: string[] = [],
  minimumRating: number = 0
) {
  const data = await getProductsPagination(sort, page, search, categoryIds, priceRanges, minimumRating);
  return data;
}

export async function createProductController(payload: {
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number | null;
  brand_id: number | null;
  description: string | null;
  status: "active" | "draft" | "archived";
}) {
  return await createAdminProduct(payload);
}

export async function updateProductController(
  id: number,
  payload: {
    name: string;
    price: number;
    stock: number;
    image_url: string;
    category_id: number | null;
    brand_id: number | null;
    description: string | null;
    status: "active" | "draft" | "archived";
  }
) {
  return await updateAdminProduct(id, payload);
}

export async function deleteProductController(id: number) {
  return await deleteAdminProduct(id);
}


