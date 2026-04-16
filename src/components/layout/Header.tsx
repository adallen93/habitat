import type { ActiveTab } from '../../types';
import { ExportImport } from '../shared/ExportImport';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onExport: () => void;
  onImport: (json: string) => { success: boolean; message: string };
}

export function Header({ activeTab, onTabChange, onExport, onImport }: Props) {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-stone-800">habitat</span>
          <div className="flex bg-stone-100 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => onTabChange('checkin')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'checkin'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              Check-in
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-stone-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              History
            </button>
          </div>
        </div>
        <ExportImport onExport={onExport} onImport={onImport} />
      </div>
    </header>
  );
}
