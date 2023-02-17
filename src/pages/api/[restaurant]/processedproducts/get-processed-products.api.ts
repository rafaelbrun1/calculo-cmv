import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetProcessedProducts(
  req: NextApiRequest,
  res: NextApiResponse
) { 

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const restaurantId = String(req.query.restaurant)

  const processed_products = await prisma.procesedProducts.findMany({ 
      select: { 
        id: true,
        name: true, 
        sell_price_in_cents: true,
      }, 
      where: { 
        restaurantId 
      },
  })

  console.log(processed_products)

  return res.json( processed_products )
}