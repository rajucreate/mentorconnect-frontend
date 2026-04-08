import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getMyMatches } from '../api/matchApi';
import { getMySessions, getMentorSessions } from '../api/sessionApi';
import { NotificationContext } from './NotificationStore';

const POLL_MS = 12000;

const normalizeResponseList = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  return [];
};

const buildMap = (items) => {
  const map = new Map();
  items.forEach((item) => {
    const id = item?.id ?? item?._id ?? item?.matchId ?? item?.sessionId;
    if (id !== undefined && id !== null) {
      map.set(String(id), item?.status || 'UNKNOWN');
    }
  });
  return map;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const previousMatchMapRef = useRef(new Map());
  const previousSessionMapRef = useRef(new Map());

  const pushNotification = useCallback((message) => {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications((prev) => [notification, ...prev].slice(0, 50));
    setUnreadCount((prev) => prev + 1);
  }, []);

  const compareAndNotify = useCallback((previousMap, nextMap, itemType) => {
    nextMap.forEach((status, key) => {
      const previousStatus = previousMap.get(key);
      if (previousStatus && previousStatus !== status) {
        const lowerStatus = String(status).toLowerCase();
        if (itemType === 'match') {
          pushNotification(`Your match request was updated to ${lowerStatus}.`);
        } else {
          pushNotification(`A session status was updated to ${lowerStatus}.`);
        }
      }
    });
  }, [pushNotification]);

  useEffect(() => {
    if (!user?.role || user.role === 'ADMIN') {
      return;
    }

    const poll = async () => {
      try {
        const matchResponse = await getMyMatches();
        const matches = normalizeResponseList(matchResponse);
        const nextMatchMap = buildMap(matches);
        compareAndNotify(previousMatchMapRef.current, nextMatchMap, 'match');
        previousMatchMapRef.current = nextMatchMap;
      } catch {
        // Intentionally silent to keep notifications non-blocking.
      }

      try {
        const sessionResponse = user.role === 'MENTOR' ? await getMentorSessions() : await getMySessions();
        const sessions = normalizeResponseList(sessionResponse);
        const nextSessionMap = buildMap(sessions);
        compareAndNotify(previousSessionMapRef.current, nextSessionMap, 'session');
        previousSessionMapRef.current = nextSessionMap;
      } catch {
        // Intentionally silent to keep notifications non-blocking.
      }
    };

    poll();
    const intervalId = setInterval(() => {
      poll();
    }, POLL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [compareAndNotify, user]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  }, []);

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    markAllAsRead,
  }), [markAllAsRead, notifications, unreadCount]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
