import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth].api";

const createFinalProductSchema = z.object({
  cod: z.string().nullable(),
  cost_in_cents: z.number(),
  name: z.string(),
  und: z.string(),
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
  const restaurantId = String(req.query.restaurant)

}