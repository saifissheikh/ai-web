import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

export const productRepository = {
  getProduct(productId: number) {
    // Implementation to fetch product by ID
    return prisma.product.findUnique({
      where: { id: productId },
    });
  },
};
