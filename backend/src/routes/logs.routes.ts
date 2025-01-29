import { Router } from 'express';
import { logger } from '../utils/logger';

const router = Router();

router.post('/logs', (req, res) => {
  const logData = req.body;
  
  logger.log({
    level: logData.level,
    message: logData.message,
    ...logData,
    source: 'frontend'
  });

  res.status(200).json({ message: 'Log received' });
});

export default router;