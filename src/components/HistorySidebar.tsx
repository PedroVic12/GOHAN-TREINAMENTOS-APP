import React from 'react';
import { Session } from '../lib/historyTypes';
import { useHistoryStorage } from '../hooks/useHistoryStorage';

interface HistorySidebarProps {
  onSessionSelect: (sessionId: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ onSessionSelect }) => {
  const { sessions } = useHistoryStorage();

  const handleSessionClick = (session: Session) => {
    // TODO: Implement logic to load and display the clicked session data
    console.log('Session clicked:', session.id, session.name);
    onSessionSelect(session.id);
  };
  
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-background to-secondary/30 p-4 overflow-y-auto transition-transform transform-none ease-in-out duration-300 z-20">
      <h2 className="text-lg font-semibold mb-4">History</h2>
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

export default HistorySidebar;