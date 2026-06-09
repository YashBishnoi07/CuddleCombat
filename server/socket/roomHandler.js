export const setupRoomHandlers = (io, socket, rooms) => {
  socket.on('join_room', ({ roomId, prefs }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        users: new Set(),
        swipes: {},
        prefs: prefs || { services: '', genres: '' }
      });
    } else if (prefs && (prefs.services || prefs.genres)) {
      // If the host joins slightly later or re-joins, update the room prefs
      rooms.get(roomId).prefs = prefs;
    }

    const room = rooms.get(roomId);
    room.users.add(socket.id);
    if (!room.swipes[socket.id]) {
      room.swipes[socket.id] = new Set();
    }

    console.log(`Socket ${socket.id} joined room ${roomId}. Users in room: ${room.users.size}`);

    // Send the room's stored preferences to the user who just joined
    socket.emit('room_prefs', room.prefs);

    if (room.users.size >= 2) {
      io.to(roomId).emit('room_ready', {
        message: 'Partner connected!'
      });
    }
  });

  socket.on('swipe_right', ({ roomId, movieId, movieData }) => {
    const room = rooms.get(roomId);
    if (!room) return;

    if (!room.swipes[socket.id]) {
        room.swipes[socket.id] = new Set();
    }
    room.swipes[socket.id].add(movieId);

    const otherUsers = Array.from(room.users).filter(id => id !== socket.id);
    if (otherUsers.length > 0) {
      const partnerId = otherUsers[0];
      if (room.swipes[partnerId] && room.swipes[partnerId].has(movieId)) {
        console.log(`MATCH found in room ${roomId} for movie ${movieId}!`);
        io.to(roomId).emit('match', {
          movieId,
          movieData
        });
      }
    }
  });

  socket.on('swipe_left', ({ roomId, movieId }) => {

  });
  
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        const room = rooms.get(roomId);
        if (room) {
          room.users.delete(socket.id);
          if (room.users.size === 0) {
            rooms.delete(roomId);
          } else {
             io.to(roomId).emit('partner_left');
          }
        }
      }
    }
  });
};
