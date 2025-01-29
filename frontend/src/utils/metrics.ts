import { NextApiResponse } from 'next';

export const responseTimeMetric = (res: NextApiResponse, startTime: number) => {
  const duration = Date.now() - startTime;
  
  // Custom header for response time
  res.setHeader('X-Response-Time', `${duration}ms`);
  
  // اینجا می‌توانیم متریک‌های سفارشی دیگر را هم اضافه کنیم
};