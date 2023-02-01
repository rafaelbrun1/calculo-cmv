import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function CreateRestaurant(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const restaurants = await prisma.restaurant.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return res.status(201).json({ restaurants });
}
