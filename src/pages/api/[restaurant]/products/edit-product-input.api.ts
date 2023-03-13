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


  const { quantity, id, cost_in_cents, name, und } = updateInputSchema.parse(
    req.body
  );

  const edit_inputs = await prisma.productsInputs.update({
   where: { 
     id,
   }, 
   data: { 
     quantity,
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
