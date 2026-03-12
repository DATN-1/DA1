import { NextResponse } from "next/server";
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




