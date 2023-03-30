import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetProcessedProductsInputs(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const id = String(req.query.id);

  const processed_products_inputs =
    await prisma.processedProductsInputs.findMany({
      where: {
        procesedProductsId: id,
      },
      select: {
        id: true,
        quantity: true,
        inputs: {
          select: {
            id: true,
            name: true,
            und: true,
            cost_in_cents: true,
          },
        },
        processedProductsAsInput: {
          select: {
            id: true,
            name: true,
          },
        },
        processedProducts: { 
          select: { 
            sell_price_in_cents: true,
          }
        }
      },
    });

  console.log(processed_products_inputs);

  return res.json(processed_products_inputs);
}
