import { useState, useEffect, useCallback } from 'react';
import { Session } from '../lib/historyTypes'; // Assuming historyTypes.ts is in the same directory or correctly imported

const STORAGE_KEY = 'learnlite_sessions';

export const useHistoryStorage = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load sessions from localStorage on initial render
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedSessions = localStorage.getItem(STORAGE_KEY);
        if (savedSessions) {
          const parsedSessions: Session[] = JSON.parse(savedSessions);
          setSessions(parsedSessions);
        }
      }
    } catch (error) {
      console.error('Failed to load sessions from localStorage:', error);
      // Handle parsing errors or other localStorage issues gracefully
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save sessions to localStorage whenever the 'sessions' state changes
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save sessions to localStorage:', error);
        // Handle potential storage full errors or other issues
      }
    }
  }, [sessions, isInitialized]);

  const saveSession = useCallback((session: Session) => {
    setSessions((prevSessions) => {
      // Optional: Check for duplicate IDs if necessary, though UUID should prevent this
      const updatedSessions = [...prevSessions, session];
      return updatedSessions;
    });
  }, []);

  const getSessions = useCallback(() => {
    return sessions;
  }, [sessions]);

  const getSessionById = useCallback((id: string): Session | undefined => {
    return sessions.find((session) => session.id === id);
  }, [sessions]);

  const deleteSession = useCallback((id: string) => {
    setSessions((prevSessions) => prevSessions.filter((session) => session.id !== id));
  }, []);

  const clearAllSessions = useCallback(() => {
    setSessions([]);
  }, []);

  return {
    sessions,
    saveSession,
    getSessions,
    getSessionById,
    deleteSession,
    clearAllSessions,
    isInitialized // Useful for knowing when the initial load is complete
  };
};