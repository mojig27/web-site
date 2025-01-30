import { Router } from 'express';
import { BackupService } from '../services/backup.service';
import { adminAuthMiddleware } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();
const backupService = new BackupService();

// لیست پشتیبان‌ها
router.get('/backups', adminAuthMiddleware, async (req, res) => {
  try {
    const backups = await backupService.listBackups();
    res.json({ success: true, data: backups });
  } catch (error) {
    logger.error('Failed to list backups:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list backups' 
    });
  }
});

// بازیابی پشتیبان
router.post('/backups/restore/:key', adminAuthMiddleware, async (req, res) => {
  try {
    await backupService.restoreBackup(req.params.key);
    res.json({ 
      success: true, 
      message: 'Backup restored successfully' 
    });
  } catch (error) {
    logger.error('Failed to restore backup:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to restore backup' 
    });
  }
});

export default router;