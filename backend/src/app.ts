// src/app.ts
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;