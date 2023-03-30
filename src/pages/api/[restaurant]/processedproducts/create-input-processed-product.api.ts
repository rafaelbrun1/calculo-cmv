import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const createInputOnProcessedProductSchema = z.object({
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

  const { input, id } = createInputOnProcessedProductSchema.parse(req.body);

  const create_processed_products_inputs = await Promise.all(input.map((item) => {
    if (item.input_type === "input") {
      return prisma.processedProductsInputs.create({
        data: {
          quantity: item.quantity,
          inputsId: item.value,
          procesedProductsId: id,
          restaurantId,
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
          processedProducts: { 
            select: { 
              id: true, 
              name: true,
            }
          }
        }
      });
    }
    return prisma.processedProductsInputs.create({
      data: {
        quantity: item.quantity,
        processedProductsIdAsInput: item.value,
        procesedProductsId: id,
        restaurantId,
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
          }
        }
      }
    });
  }));


  return res.json(create_processed_products_inputs);
}
