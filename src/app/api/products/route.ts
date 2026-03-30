import { NextResponse } from "next/server";
import {
  fetchSortedProductsController,
  fetchAllProductsController,
  createProductController,
} from "@/app/controllers/Product.Controllers";
import { assertAdminSession } from '@/app/api/_utils/adminAuth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const sort = searchParams.get("sort") || "popular";
    const page = Number(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const categoryIds = (searchParams.get("categories") || "")
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value) && value > 0);
    const priceRanges = (searchParams.get("prices") || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const minimumRating = Number(searchParams.get("minRating") || "0");
    const limit = searchParams.get("limit");

    if (limit === "all") {
      const products = await fetchAllProductsController();
      return NextResponse.json(products);
    }

    if (!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        { error: "Trang không hợp lệ" },
        { status: 400 }
      );
    }

    const result = await fetchSortedProductsController(
      sort,
      page,
      search,
      categoryIds,
      priceRanges,
      Number.isFinite(minimumRating) ? minimumRating : 0
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await assertAdminSession();
    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const body = await request.json();
    const createdId = await createProductController({
      name: String(body?.name || "").trim(),
      price: Number(body?.price || 0),
      stock: Number(body?.stock || 0),
      image_url: String(body?.image_url || "").trim(),
      category_id: body?.category_id ? Number(body.category_id) : null,
      brand_id: body?.brand_id ? Number(body.brand_id) : null,
      description: body?.description ? String(body.description).trim() : null,
      status: ["active", "draft", "archived"].includes(body?.status)
        ? body.status
        : "active",
    });

    return NextResponse.json({ message: "Tạo sản phẩm thành công", id: createdId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Không thể tạo sản phẩm" }, { status: 400 });
  }
}