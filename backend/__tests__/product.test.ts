// backend/__tests__/product.test.ts
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../src/app';
import { User } from '../src/models/User';
import { Product } from '../src/models/Product';

describe('Product Tests', () => {
  let mongoServer: MongoMemoryServer;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // راه‌اندازی دیتابیس تست
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // ایجاد کاربر ادمین
    const adminResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
    adminToken = adminResponse.body.data.token;

    // ایجاد کاربر عادی
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Normal User',
        email: 'user@example.com',
        password: 'user123'
      });
    userToken = userResponse.body.data.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // پاک کردن محصولات قبل از هر تست
    await Product.deleteMany({});
  });

  describe('POST /api/products', () => {
    const validProduct = {
      title: 'محصول تست',
      description: 'توضیحات محصول تست',
      price: 100000,
      image: 'https://example.com/image.jpg',
      category: 'الکترونیک',
      stock: 10
    };

    it('should create product when admin', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validProduct);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('title', validProduct.title);
    });

    it('should not create product when normal user', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validProduct);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should validate product data', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'ت', // عنوان خیلی کوتاه
          price: -100, // قیمت منفی
          stock: -1 // موجودی منفی
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // اضافه کردن چند محصول تست
      await Product.create([
        {
          title: 'لپ تاپ',
          description: 'لپ تاپ گیمینگ',
          price: 25000000,
          image: 'https://example.com/laptop.jpg',
          category: 'الکترونیک',
          stock: 5
        },
        {
          title: 'موبایل',
          description: 'گوشی هوشمند',
          price: 15000000,
          image: 'https://example.com/phone.jpg',
          category: 'الکترونیک',
          stock: 10
        }
      ]);
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toHaveLength(2);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ category: 'الکترونیک' });

      expect(response.status).toBe(200);
      expect(response.body.data.products).toHaveLength(2);
    });

    it('should filter products by price range', async () => {
      const response = await request(app)
        .get('/api/products')
        .query({ minPrice: 20000000, maxPrice: 30000000 });

      expect(response.status).toBe(200);
      expect(response.body.data.products).toHaveLength(1);
      expect(response.body.data.products[0].title).toBe('لپ تاپ');
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      // ایجاد یک محصول برای تست به‌روزرسانی
      const product = await Product.create({
        title: 'محصول اولیه',
        description: 'توضیحات اولیه',
        price: 100000,
        image: 'https://example.com/initial.jpg',
        category: 'عمومی',
        stock: 5
      });
      productId = product._id.toString();
    });

    it('should update product when admin', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'محصول به‌روز شده', price: 150000 });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('محصول به‌روز شده');
      expect(response.body.data.price).toBe(150000);
    });

    it('should not update product when normal user', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'محصول به‌روز شده' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId: string;

    beforeEach(async () => {
      // ایجاد یک محصول برای تست حذف
      const product = await Product.create({
        title: 'محصول حذفی',
        description: 'این محصول برای تست حذف است',
        price: 100000,
        image: 'https://example.com/delete.jpg',
        category: 'عمومی',
        stock: 1
      });
      productId = product._id.toString();
    });

    it('should delete product when admin', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // تایید حذف محصول
      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    it('should not delete product when normal user', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});