import { NextResponse } from "next/server";
import { fetchSortedProductsController } from "@/app/controllers/Product.Controllers";

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "popular";
    const page = Number(searchParams.get("page") || "1");
    const limit = searchParams.get("limit");

    if (limit === "all") {
      const result = await fetchSortedProductsController(sort, 1);
      return NextResponse.json({ 
        products: result.products ?? result,
        total: result.total ?? (Array.isArray(result) ? result.length : 0),
        totalPages: result.totalPages ?? 1, 
      });
    }

    if(!Number.isInteger(page) || page < 1) {
      return NextResponse.json(
        { error: "Trang không hợp lệ" },
        { status: 400 }
      );
    }

    const result = await fetchSortedProductsController(sort, page);

    return NextResponse.json(result);

  } catch (error) {
    console.error("API Error: ", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );

  }

}
