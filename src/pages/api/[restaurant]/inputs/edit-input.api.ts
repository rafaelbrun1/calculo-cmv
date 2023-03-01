import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const updateInputSchema = z.object({
  id: z.string(),
  cod: z.string().nullable(),
  cost_in_cents: z.number(),
  name: z.string(),
  und: z.string(),
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

  const { id, cod, cost_in_cents, name, und } = updateInputSchema.parse(
    req.body
  );

  const inputs = await prisma.inputs.update({
    data: {
      cod,
      cost_in_cents,
      name,
      und,
      restaurantId,
    },
    where: {
      id,
    },
  });

  return res.json(inputs);
}
