import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const createInputOnProductSchema = z.object({
  id: z.string(),
  input: z
    .object({
      value: z.string(),
      label: z.string(),
      quantity: z.number(),
      input_type: z.string(),
    })
    .array(),
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


  const { input, id } = createInputOnProductSchema.parse(req.body);

  const final_product_prev_price = await prisma.finalProducts.findUnique({ 
    where: { 
      id,
    }, 
    select: { 
      sell_price_in_cents: true,
    }
  })

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

  const inputs_price_multiplied_by_quantity = input.reduce(
    (accumulator, item) => {
      const product = inputs_price.find((p) => p.id === item.value);
      if (product) {
        accumulator.push({
          id: item.value,
          price_multiplied_by_quantity: product.cost_in_cents * item.quantity,
        });
      }
      return accumulator;
    },
    [{ id: "", price_multiplied_by_quantity: 0 }]
  );

  const processed_products_price = await prisma.procesedProducts.findMany({
    select: {
      id: true,
      name: true,
      sell_price_in_cents: true,
    },
    where: {
      id: { in: input.map((item) => item.value) },
    },
  })

  const sell_price_in_cents_inputs = inputs_price_multiplied_by_quantity.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price_multiplied_by_quantity,
    0
  );

  const processed_products_multiplied_by_quantity = input.reduce(
    (accumulator, item) => {
      const product = processed_products_price.find((p) => p.id === item.value);
      if (product) {
        accumulator.push({
          id: item.value,
          price_multiplied_by_quantity: product.sell_price_in_cents * item.quantity,
        });
      }
      return accumulator;
    },
    [{ id: "", price_multiplied_by_quantity: 0 }]
  );

  const sell_price_in_cents_processed_products = processed_products_multiplied_by_quantity.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price_multiplied_by_quantity,
    0
  );

  const sell_price_in_cents = sell_price_in_cents_inputs + sell_price_in_cents_processed_products

  const updated_final_price_in_cents_final_product = await prisma.finalProducts.update({ 
    where: { 
      id
    }, data: { 
      sell_price_in_cents: final_product_prev_price ? final_product_prev_price?.sell_price_in_cents + sell_price_in_cents : 0
    }, 
    select: { 
      sell_price_in_cents: true,
    }
  })

  return res.json(updated_final_price_in_cents_final_product);
}
