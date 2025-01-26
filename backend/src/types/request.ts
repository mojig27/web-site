// backend/src/types/request.ts
import { Request } from 'express';
import { z } from 'zod';
import { createProductSchema, productQuerySchema } from '@/schemas/product.schema';

export type CreateProductRequest = Request<
  {},
  {},
  z.infer<typeof createProductSchema>['body']
>;

export type GetProductsRequest = Request<
  {},
  {},
  {},
  z.infer<typeof productQuerySchema>['query']
>;