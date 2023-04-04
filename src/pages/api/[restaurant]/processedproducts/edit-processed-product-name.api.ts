import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const updateProcessedProductNameSchema = z.object({
 id: z.string(), 
 name: z.string()
});

export default async function UpdateProcessedProductName(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).end();
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).end();
  }

  const {id, name} = updateProcessedProductNameSchema.parse(req.body)


  const update_processed_product_name = await prisma.procesedProducts.update({ 
    data: { 
      name,
    }, 
    where: { 
      id,
    }
  })


  return res.json(update_processed_product_name)
}