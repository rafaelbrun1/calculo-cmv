import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetFinalProductsInputs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const id = String(req.query.id);

  const final_products_inputs = await prisma.productsInputs.findMany({
    where: {
      final_productsId: id,
    },
    select: {
      id: true,
      quantity: true,
      input: {
        select: {
          id: true,
          name: true,
          und: true,
          cost_in_cents: true,
        },
      },
      processedProducts: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  


  return res.json(final_products_inputs);
}
