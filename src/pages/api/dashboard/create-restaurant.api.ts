import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async function CreateRestaurant(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  
  const {userId, name, address, cnpj } = req.body;
  
  const createRestaraunt = await prisma.restaurant.create({
    data: {
      name,
      address,
      cnpj,
      userId,
    },
  });

  return res.json({ createRestaraunt });
}

