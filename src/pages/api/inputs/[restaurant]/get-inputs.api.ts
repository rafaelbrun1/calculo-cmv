import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetRestaurants(
  req: NextApiRequest,
  res: NextApiResponse
) { 

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const restaurantId = String(req.query.restaurant)

  const inputs = await prisma.inputs.findMany({ 
      select: { 
        id: true, 
        cod: true,
        cost_in_cents: true,
        name: true,
        und: true,
      }, 
      where: { 
        restaurantId 
      },
  })

  return res.json( inputs )
}