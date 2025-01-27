// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'فروشگاه آنلاین API',
      version: '1.0.0',
      description: 'API مستندات فروشگاه آنلاین',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'سرور توسعه',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // مسیر فایل‌های روت
};

export const specs = swaggerJsdoc(options);