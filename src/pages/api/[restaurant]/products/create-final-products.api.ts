import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const createProductSchema = z.object({
  product_name: z.string(),
  input: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .array(),
  quantity: z.number().array(),
});

export default async function CreateFinalProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).end();
  }
  const restaurantId = String(req.query.restaurant);

  const { input, product_name, quantity } = createProductSchema.parse(req.body);

  const inputs_price = await prisma.inputs.findMany({
    select: {
      name: true,
      cost_in_cents: true,
    },
    where: {
      id: { in: input.map((item) => item.value) },
    },
  });

  const inputs_price_multiplied_by_quantity = inputs_price.map((input, index) => { 
      return input.cost_in_cents * quantity[index]
  })

  const product_sell_price_in_cents = inputs_price_multiplied_by_quantity.reduce((acc, cur) => acc + cur)

  console.log(inputs_price, inputs_price_multiplied_by_quantity, quantity)

  return res.json(inputs_price);
}
