import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Session } from "../lib/historyTypes";
import { useHistoryStorage } from "../hooks/useHistoryStorage";

interface HistorySidebarProps {
  onSessionSelect: (sessionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  onSessionSelect,
  isOpen,
  onClose,
}) => {
  const { sessions } = useHistoryStorage();

  const handleSessionClick = (session: Session) => {
    console.log("Session clicked:", session.id, session.name);
    onSessionSelect(session.id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-full w-64 bg-secondary p-4 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg text-primary dark:text-white font-semibold">
              Histórico
            </h2>
            <button
              className="text-primary dark:text-white hover:text-terciary"
              onClick={onClose}>
              X
            </button>
          </div>

          {sessions.length === 0 ? (
            <p className="text-sm text-primary dark:text-white">
              Nenhuma sessão salva ainda.
            </p>
          ) : (
            <ul>
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className="cursor-pointer p-2 border-b-2 border-primary text-primary dark:text-white hover:text-terciary dark:border-white"
                  onClick={() => handleSessionClick(session)}>
                  {session.name ||
                    session.originalFileName ||
                    `Session ${session.id.substring(0, 6)}...`}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export type { HistorySidebarProps };
export default HistorySidebar;
