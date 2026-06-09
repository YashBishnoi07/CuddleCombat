import { useEffect, useState, useCallback } from 'react';
import { socket } from '../services/socket';

export const useSocket = (roomId) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [partnerConnected, setPartnerConnected] = useState(false);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    socket.connect();

    const onConnect = () => {
      setIsConnected(true);
      if (roomId) {
        const prefsStr = localStorage.getItem(`prefs_${roomId}`);
        const prefs = prefsStr ? JSON.parse(prefsStr) : null;
        socket.emit('join_room', { roomId, prefs });
      }
    };

    const onDisconnect = () => setIsConnected(false);

    const onRoomPrefs = (prefs) => {
      if (prefs) {
        localStorage.setItem(`prefs_${roomId}`, JSON.stringify(prefs));
      }
    };

    const onRoomReady = (data) => {
      setPartnerConnected(true);
    };

    const onMatch = (data) => {
      setMatchData(data);
    };

    const onPartnerLeft = () => {
      setPartnerConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_prefs', onRoomPrefs);
    socket.on('room_ready', onRoomReady);
    socket.on('match', onMatch);
    socket.on('partner_left', onPartnerLeft);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_prefs', onRoomPrefs);
      socket.off('room_ready', onRoomReady);
      socket.off('match', onMatch);
      socket.off('partner_left', onPartnerLeft);
    };
  }, [roomId]);

  const emitSwipe = useCallback((type, movieId, movieData) => {
    if (type === 'right') {
      socket.emit('swipe_right', { roomId, movieId, movieData });
    } else {
      socket.emit('swipe_left', { roomId, movieId });
    }
  }, [roomId]);

  return { isConnected, partnerConnected, matchData, emitSwipe };
};
