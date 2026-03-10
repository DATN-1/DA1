import { NextResponse } from "next/server";
import { fetchSortedProductsController } from "@/app/controllers/Product.Controllers";

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "popular";

    const products = await fetchSortedProductsController(sort);

    return NextResponse.json(products);

  } catch (error) {

    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );

  }

}