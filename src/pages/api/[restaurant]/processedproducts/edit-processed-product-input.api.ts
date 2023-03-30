import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const updateInputSchema = z.object({
  id: z.string(),
  cost_in_cents: z.number(),
  name: z.string(),
  und: z.string(),
  quantity: z.number(),
  prev_sell_price_in_cents_final_product: z.number(),
});

export default async function UpdateInputProcessedProduct(
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


  const { quantity, id, cost_in_cents, name, und, prev_sell_price_in_cents_final_product } = updateInputSchema.parse(
    req.body
  );

  const prev_sell_price_in_cents_input = await prisma.processedProductsInputs.findUnique({ 
    where: { 
      id,
    }, 
    select: { 
      quantity: true,
      inputs: { 
        select: { 
          cost_in_cents: true,
        }
      }
    }
  })

  console.log(prev_sell_price_in_cents_input)

  const inputQuantity = prev_sell_price_in_cents_input ? prev_sell_price_in_cents_input.quantity : 0;
  const inputCostInCents = prev_sell_price_in_cents_input?.inputs?.cost_in_cents ?? 0;
  const sell_price_in_cents = (prev_sell_price_in_cents_final_product - (inputQuantity * inputCostInCents) + (quantity * cost_in_cents));

  const edit_inputs = await prisma.processedProductsInputs.update({
   where: { 
     id,
   }, 
   data: { 
     quantity,
     processedProducts: { 
       update: { 
         sell_price_in_cents,
       },
     },
     inputs: { 
       update: { 
         cost_in_cents,
         name,
         und
       }
     }
   }, 
   select: { 
     id: true,
     quantity: true,
     processedProducts: { 
       select: { 
         sell_price_in_cents: true,
       },
     },
     inputs: { 
       select: { 
         cost_in_cents: true,
         name: true,
         und: true,
       }
     },
   }
 });

  return res.json(edit_inputs);
}
