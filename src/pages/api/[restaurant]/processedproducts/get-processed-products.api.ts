import { prisma } from "@/src/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetProcessedProducts(
  req: NextApiRequest,
  res: NextApiResponse
) { 

  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const restaurantId = String(req.query.restaurant)

  const processed_products = await prisma.procesedProducts.findMany({ 
      select: { 
        id: true,
        name: true, 
        ProcessedProductsInputs: { 
          select: { 
            quantity: true,
            inputs: { 
              select: { 
                name: true,
                cost_in_cents: true,
              }
            },
            processedProductsAsInput: { 
              select: { 
                name: true,
                ProcessedProductsInputs: { 
                  select: { 
                    quantity: true,
                    inputs: { 
                      select: { 
                        name: true,
                        cost_in_cents: true,
                      }
                    }, 
                    processedProductsAsInput: { 
                      select: { 
                        name: true,
                        ProcessedProductsInputs: { 
                          select: { 
                            quantity: true,
                            inputs: { 
                              select: { 
                                name: true,
                                cost_in_cents: true,
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }, 
      where: { 
        restaurantId 
      },
  })



  return res.json( processed_products )
}