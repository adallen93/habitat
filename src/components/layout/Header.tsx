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
    <header className="bg-stone-900 border-b border-stone-700 sticky top-0 z-40">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight text-stone-100">habitat</span>
          <div className="flex bg-stone-800 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => onTabChange('checkin')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'checkin'
                  ? 'bg-stone-700 text-stone-100 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Check-in
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'history'
                  ? 'bg-stone-700 text-stone-100 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
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
