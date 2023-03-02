import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../../auth/[...nextauth].api";


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

  const restaurantId = String(req.query.restaurant);
  const productId = String(req.query.id)

  const {quantity, id, cost_in_cents, name, und } = updateInputSchema.parse(
    req.body
  );


    return res.json('');
}
