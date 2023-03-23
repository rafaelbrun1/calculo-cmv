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

export default async function CreateInputFinalProduct(
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

  const { input, id } = createInputOnProductSchema.parse(req.body);

  const create_products_inputs = input.map((item) => {
    if (item.input_type === "input") {
      return prisma.productsInputs.create({
        data: {
          quantity: item.quantity,
          inputsId: item.value,
          final_productsId: id,
          restaurantId,
        },
      });
    }
    return prisma.productsInputs.create({
      data: {
        quantity: item.quantity,
        procesedProductsId: item.value,
        final_productsId: id,
        restaurantId,
      },
    });
  });

  

  Promise.all(create_products_inputs);


  return res.json("");
}
