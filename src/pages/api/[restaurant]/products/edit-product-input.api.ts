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

export default async function UpdateInput(
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

  const prev_sell_price_in_cents_input = await prisma.productsInputs.findUnique({ 
    where: { 
      id,
    }, 
    select: { 
      quantity: true,
      input: { 
        select: { 
          cost_in_cents: true,
        }
      }
    }
  })

  console.log(prev_sell_price_in_cents_input)

  const inputQuantity = prev_sell_price_in_cents_input ? prev_sell_price_in_cents_input.quantity : 0;
  const inputCostInCents = prev_sell_price_in_cents_input?.input?.cost_in_cents ?? 0;
  const sell_price_in_cents = (prev_sell_price_in_cents_final_product - (inputQuantity * inputCostInCents) + (quantity * cost_in_cents));

  const edit_inputs = await prisma.productsInputs.update({
   where: { 
     id,
   }, 
   data: { 
     quantity,
     product: { 
       update: { 
         sell_price_in_cents,
       },
     },
     input: { 
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
     product: { 
       select: { 
         sell_price_in_cents: true,
       },
     },
     input: { 
       select: { 
         cost_in_cents: true,
         name: true,
         und: true,
       }
     },
   }
 });



 console.log(edit_inputs)

  return res.json(edit_inputs);
}
