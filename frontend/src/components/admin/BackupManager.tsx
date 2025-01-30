import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface Backup {
  key: string;
  timestamp: string;
  size: number;
}

export const BackupManager: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/backups');
      const data = await response.json();
      if (data.success) {
        setBackups(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch backups');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (key: string) => {
    if (!window.confirm('Are you sure you want to restore this backup?')) {
      return;
    }

    try {
      setRestoring(true);
      const response = await fetch(`/api/backups/restore/${key}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Backup restored successfully');
      }
    } catch (error) {
      toast.error('Failed to restore backup');
    } finally {
      setRestoring(false);
    }
  };

  if (loading) {
    return <div>Loading backups...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Backup Management</h2>
      <div className="grid gap-4">
        {backups.map((backup) => (
          <div key={backup.key} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-medium">{backup.timestamp}</p>
              <p className="text-sm text-gray-600">Size: {(backup.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              onClick={() => handleRestore(backup.key)}
              disabled={restoring}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {restoring ? 'Restoring...' : 'Restore'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};