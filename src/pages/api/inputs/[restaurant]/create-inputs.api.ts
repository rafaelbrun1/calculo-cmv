import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const createInputSchema = z.object({
  cod: z.string().nullable(),
  cost_in_cents: z.number(),
  name: z.string(),
  und: z.string(),
});

export default async function CreateInput(
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
  const restaurantId = String(req.query.restaurant)
  console.log(restaurantId)
  
  const { cod, cost_in_cents, name, und } =
    createInputSchema.parse(req.body);

  const inputs = await prisma.inputs.create({
    data: {
      cod,
      cost_in_cents,
      name,
      und,
      restaurantId,
    },
  });

  return res.json( inputs );
}
