import { useState, useCallback } from 'react';
import type { ActiveTab, HabitId } from './types';
import { useHabitStore } from './hooks/useHabitStore';
import { Header } from './components/layout/Header';
import { CheckInTab } from './components/checkin/CheckInTab';
import { HistoryTab } from './components/history/HistoryTab';
import { todayString } from './lib/dateUtils';

function getInitialTab(): ActiveTab {
  const hash = window.location.hash.replace('#', '');
  return hash === 'history' ? 'history' : 'checkin';
}

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(getInitialTab);
  const [checkinDate, setCheckinDate] = useState<string | null>(null);
  const { records, saveRecord, getRecord, exportData, importData } = useHabitStore();

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  }, []);

  const handleDateClick = useCallback((date: string) => {
    setCheckinDate(date);
    setActiveTab('checkin');
    window.location.hash = 'checkin';
  }, []);

  const wrappedSaveRecord = useCallback((date: string, completed: HabitId[]) => {
    setCheckinDate(null);
    return saveRecord(date, completed);
  }, [saveRecord]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onExport={exportData}
        onImport={importData}
      />
      <main>
        {activeTab === 'checkin' ? (
          <CheckInTab
            key={checkinDate ?? 'today'}
            getRecord={getRecord}
            saveRecord={wrappedSaveRecord}
            initialDate={checkinDate ?? todayString()}
          />
        ) : (
          <HistoryTab
            records={records}
            onDateClick={handleDateClick}
          />
        )}
      </main>
    </div>
  );
}

export default App;
