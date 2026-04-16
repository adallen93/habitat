import { useState, useCallback } from 'react';
import type { DayRecord, HabitId } from '../types';
import * as storage from '../lib/storage';

export function useHabitStore() {
  const [records, setRecords] = useState<Record<string, DayRecord>>(() => storage.getAllRecords());

  const refresh = useCallback(() => {
    setRecords(storage.getAllRecords());
  }, []);

  const saveRecord = useCallback((date: string, completed: HabitId[]) => {
    const record = storage.saveRecord(date, completed);
    setRecords(prev => ({ ...prev, [date]: record }));
    return record;
  }, []);

  const getRecord = useCallback((date: string): DayRecord | null => {
    return records[date] ?? null;
  }, [records]);

  const exportData = useCallback(() => {
    const json = storage.exportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `habitat-backup-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importData = useCallback((json: string): { success: boolean; message: string } => {
    const result = storage.importJson(json);
    if (result.success) {
      refresh();
    }
    return result;
  }, [refresh]);

  return { records, saveRecord, getRecord, exportData, importData };
}
