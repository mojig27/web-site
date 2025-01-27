// test/product.test.ts
import request from 'supertest';
import app from '@/app';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { connectDB, closeDB } from '@/config/database';
import { createToken } from '@/utils/token';

describe('Product Tests', () => {
  let token: string;
  let adminToken: string;
  let productId: string;

  beforeAll(async () => {
    await connectDB();
    
    // ایجاد کاربر عادی
    const user = await User.create({
      name: 'تست کاربر',
      email: 'user@test.com',
      password: 'password123',
      role: 'user'
    });
    token = createToken(user._id);

    // ایجاد کاربر ادمین
    const admin = await User.create({
      name: 'تست ادمین',
      email: 'admin@test.com',
      password: 'password123',
      role: 'admin'
    });
    adminToken = createToken(admin._id);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await closeDB();
  });

  describe('POST /api/products', () => {
    it('should create a new product when admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'محصول تست',
          description: 'توضیحات تست محصول',
          price: 1000,
          image: 'https://example.com/image.jpg',
          category: 'تست',
          stock: 10
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      productId = res.body.data._id;
    });

    it('should not create product when user is not admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'محصول تست',
          description: 'توضیحات تست محصول',
          price: 1000,
          image: 'https://example.com/image.jpg',
          category: 'تست',
          stock: 10
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.products)).toBe(true);
    });

    it('should filter products by category', async () => {
      const res = await request(app)
        .get('/api/products')
        .query({ category: 'تست' });

      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThan(0);
      expect(res.body.data.products[0].category).toBe('تست');
    });
  });
});