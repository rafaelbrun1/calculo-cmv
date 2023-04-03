import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const deleteInputOnProcessedProductSchema = z.object({
  id: z.string(),
});

export default async function DeleteInputProcessedProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).end();
  }


  const { id } = deleteInputOnProcessedProductSchema.parse(req.body)

  const deleteInputProduct = await prisma.processedProductsInputs.delete({ 
    where: { 
      id
    }, 
  })


  return res.json(deleteInputProduct);
}