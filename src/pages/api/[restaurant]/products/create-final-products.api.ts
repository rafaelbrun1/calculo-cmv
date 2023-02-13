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
      quantity: z.number(),
    })
    .array(),
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

  const { input, product_name } = createProductSchema.parse(req.body);

  const inputs_price = await prisma.inputs.findMany({
    select: {
      id: true,
      name: true,
      cost_in_cents: true,
    },
    where: {
      id: { in: input.map((item) => item.value) },
    },
  });

  const inputs_price_multiplied_by_quantity = input.reduce((accumulator, item) => {
    const product = inputs_price.find(p => p.id === item.value);
    if (product) {
      accumulator.push({
        id: item.value,
        price_multiplied_by_quantity: product.cost_in_cents * item.quantity
      });
    }
    return accumulator;
  }, [{id: '', price_multiplied_by_quantity: 0}]);

  const sell_price_in_cents = inputs_price_multiplied_by_quantity.reduce((accumulator, currentValue) => accumulator + currentValue.price_multiplied_by_quantity, 0);


  const final_product = await prisma.finalProducts.create({ 
    data: { 
      name: product_name,
      sell_price_in_cents,
      restaurantId
    }
  })

  console.log(final_product)

  return res.json(inputs_price);
}
