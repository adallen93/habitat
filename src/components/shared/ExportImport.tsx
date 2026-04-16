import { useState, useRef } from 'react';
import { Modal } from './Modal';

interface Props {
  onExport: () => void;
  onImport: (json: string) => { success: boolean; message: string };
}

export function ExportImport({ onExport, onImport }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const json = ev.target?.result as string;
      if (!window.confirm('This will replace all existing data. Continue?')) return;
      const result = onImport(json);
      setMessage({ text: result.message, ok: result.success });
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-stone-800"
        title="Export or import data"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
        Data
      </button>

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setMessage(null); }} title="Export / Import">
        <div className="space-y-4">
          <p className="text-sm text-stone-400 mb-3">
            Export your data as a JSON backup file, or import a previous backup.
          </p>

          <button
            onClick={() => { onExport(); setMessage({ text: 'Data exported.', ok: true }); }}
            className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-white text-stone-900 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Backup
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 border border-stone-700 hover:border-stone-500 text-stone-300 text-sm font-medium py-2.5 px-4 rounded-xl transition-colors hover:bg-stone-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Import Backup
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

          {message && (
            <p className={`text-sm text-center font-medium ${message.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
              {message.text}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
