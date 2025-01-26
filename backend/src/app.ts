// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from '@/middleware/error';
import authRoutes from '@/routes/auth.routes';
import productRoutes from '@/routes/product.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

export default app;