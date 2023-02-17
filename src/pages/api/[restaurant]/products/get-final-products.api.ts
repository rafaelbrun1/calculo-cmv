import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetFinalProducts(
  req: NextApiRequest,
  res: NextApiResponse
) { 

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const restaurantId = String(req.query.restaurant)

  const final_products = await prisma.finalProducts.findMany({ 
      select: { 
        id: true,
        name: true, 
        sell_price_in_cents: true,
      }, 
      where: { 
        restaurantId 
      },
  })

  return res.json( final_products )
}