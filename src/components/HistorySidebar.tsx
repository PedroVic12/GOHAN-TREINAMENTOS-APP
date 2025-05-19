import React from 'react';
import { Session } from '../lib/historyTypes';
import { useHistoryStorage } from '../hooks/useHistoryStorage';

interface HistorySidebarProps {
  onSessionSelect: (sessionId: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ onSessionSelect, isSidebarOpen, setIsSidebarOpen }) => {
  const { sessions } = useHistoryStorage();

  const handleSessionClick = (session: Session) => {
    console.log('Session clicked:', session.id, session.name);
    onSessionSelect(session.id);
  };

  return (
    <div className={
      `fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-background to-secondary/30 p-4 overflow-y-auto transform transition-transform ease-in-out duration-300 z-20` +
      (isSidebarOpen ? ' translate-x-0' : ' -translate-x-full') +
      (isSidebarOpen ? ' block' : ' hidden')
    }>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Histórico</h2>
        {isSidebarOpen && (
          <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsSidebarOpen(false)}>
            X
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-gray-500">No sessions saved yet.</p>
      ) : (
        <ul>
          {sessions.map((session) => (
            <li
              key={session.id}
              className="cursor-pointer p-2 hover:bg-gray-200 rounded"
              onClick={() => handleSessionClick(session)}
            >
              {session.name || session.originalFileName || `Session ${session.id.substring(0, 6)}...`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export type { HistorySidebarProps };
export default HistorySidebar;