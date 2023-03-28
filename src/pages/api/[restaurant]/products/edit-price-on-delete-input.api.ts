import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const editPriceOnDeleteSchema = z.object({
  cost_in_cents: z.number(),
  finalProductId: z.string(),
});

export default async function EditPriceOnDeleteInput(
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

  const { cost_in_cents, finalProductId } = editPriceOnDeleteSchema.parse(
    req.body
  );

  const find_final_product_price = await prisma.finalProducts.findUnique({
    where: {
      id: finalProductId,
    },
    select: {
      sell_price_in_cents: true,
    },
  });

  const edit_product_final_price = await prisma.finalProducts.update({
    where: {
      id: finalProductId,
    },
    data: {
      sell_price_in_cents:
        (find_final_product_price?.sell_price_in_cents ?? 0) -
        (cost_in_cents ?? 0),
    },
  });

  return res.json(edit_product_final_price);
}
