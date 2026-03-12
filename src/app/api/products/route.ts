import { NextResponse } from "next/server";
<<<<<<< HEAD
import { fetchAllProductsController } from "@/app/controllers/Product.Controllers";

export async function GET() {
  try   {

    const products = await fetchAllProductsController();

    return NextResponse.json(products);
    
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" }, 
      { status: 500 }
    );
  }
}




=======
import { fetchSortedProductsController } from "@/app/controllers/Product.Controllers";

export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "popular";
    const page = Number(searchParams.get("page") || "1");
    const limit = searchParams.get("limit");

    if (limit === "all") {
      const result = await fetchSortedProductsController(sort, 1);
      return NextResponse.json({ products: result });
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
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
