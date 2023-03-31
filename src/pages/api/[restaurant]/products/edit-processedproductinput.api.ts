import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const editProcessedProductQuantity = z.object({
  id: z.string(),
  quantity: z.number()
});

export default async function EditFinalProductPrice(
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

  const {id, quantity } = editProcessedProductQuantity.parse(req.body)

  const edit_processed_product_quantity = await prisma.productsInputs.update({ 
    where: { 
      id,
    }, 
    data: { 
      quantity
    }
  })

  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:', req.body)

  return res.json(edit_processed_product_quantity)
}