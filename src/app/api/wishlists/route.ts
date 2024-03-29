import WishList from "@/db/models/wishlist";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body, ">>>>>>>>>>>>>> body");
    const idUser = request.headers.get("userId") as string;
    // console.log(idUser, "<<<<<<<<<<<<");
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${body}/information`,
      {
        headers: {
          "x-api-key": "32ab990db30641cb99a50948f6caecd6",
        },
      }
    );
    if (!res.ok) {
      throw new Error("Failed fetch");
    }
    const result = await res.json();
    const {
      title,
      image,
      summary,
      servings,
      analyzedInstructions,
      extendedIngredients,
    } = result;
    // console.log(summary, ">>>>>>>>>>>>>>");
    const wishlist = await WishList.createWishList({
      reciptId: body,
      userId: idUser,
      title: title,
      image: image,
      summary: summary,
      servings: servings,
      analyzedInstructions: analyzedInstructions.map((item: any) => item.steps),
      extendedIngredients: extendedIngredients,
    });
    return NextResponse.json({ data: wishlist });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      error: "Internal Server Error",
    });
  }
}

export async function GET(request: Request) {
  console.log("get all wishlist")
  try {
    const idUser = request.headers.get("userId") as string;
    console.log(idUser, "<<<<<<<<<<<< ID User");
    const myRecipes = await WishList.getMyRecipes(idUser);
    return NextResponse.json({ data: myRecipes });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

export async function GETBYID(request: Request) {
  try {
    const body = await request.json();
    const idUser = request.headers.get("userId") as string;
    const wishlist = await WishList.getMyRecipesById(idUser, body.reciptId);
    return NextResponse.json({ data: wishlist });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
// export async function DELETE(request: Request) {
//   try {
//     const body = await request.json();
//     const idUser = request.headers.get("userId") as string;
//     const wishlist = await WishList.deleteWishList(body, idUser);
//     return NextResponse.json({ data: wishlist });
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json({ error: "Internal Server Error" });
//   }
// }
