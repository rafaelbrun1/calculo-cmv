import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].api";


export default async function CreateRestaurant(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  
  const {name, address, cnpj } = req.body;

  const session = await unstable_getServerSession(req, res, authOptions);
  
  if (!session) { 
    return res.status(404).end()
  }
  
  const createRestaraunt = await prisma.restaurant.create({
    data: {
      name,
      address,
      cnpj,
      userId: session.user.id,
    },
  });

  return res.json({ createRestaraunt });
}

