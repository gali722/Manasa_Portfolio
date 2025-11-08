import api from '../lib/axios';

export const backupService = {
  /**
   * Create a new backup
   */
  createBackup: async () => {
    const response = await api.post('/admin/backup');
    return response.data;
  },

  /**
   * Restore from backup
   */
  restoreBackup: async (backupData) => {
    const response = await api.post('/admin/restore', { backup: backupData });
    return response.data;
  },

  /**
   * List all available backups
   */
  listBackups: async () => {
    const response = await api.get('/admin/backups');
    return response.data;
  },

  /**
   * Delete a backup
   */
  deleteBackup: async (filename) => {
    const response = await api.delete(`/admin/backups/${filename}`);
    return response.data;
  },
};
