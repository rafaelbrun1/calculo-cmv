import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function DeleteFinalProduct(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).end();
  }

  const { id } = req.body;

  await prisma.finalProducts.delete({
    where: {
      id,
    },
  });

  return res.json({ Message: `${id} deletado` });
}
