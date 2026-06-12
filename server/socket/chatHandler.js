import Message from '../models/Message.js';

export const setupChatHandlers = (io, socket) => {
  socket.on('join_global_chat', () => {
    socket.join('global_chat');
  });

  socket.on('send_global_message', async (data) => {
    try {
      const { userId, username, text } = data;
      
      const newMessage = await Message.create({
        user: userId,
        username,
        text
      });

      io.to('global_chat').emit('receive_global_message', {
        _id: newMessage._id,
        user: { _id: userId, username },
        username,
        text,
        createdAt: newMessage.createdAt
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
};
