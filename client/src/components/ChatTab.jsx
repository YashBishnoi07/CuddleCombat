import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import styles from './ChatTab.module.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const ChatTab = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/api/chat`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      }
    };
    fetchMessages();

    // Connect to global socket
    socketRef.current = io(API_URL);
    socketRef.current.emit('join_global_chat');

    socketRef.current.on('receive_global_message', (msg) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    socketRef.current.emit('send_global_message', {
      userId: user._id,
      username: user.username,
      text: inputText
    });

    setInputText('');
  };

  const quickEmojis = ['😂', '😍', '😭', '🔥', '👍', '🍿', '🎬', '👻'];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ textAlign: 'left', width: '100%', fontSize: '24px' }}>Your Chat</h2>
      </div>

      <div className={styles.chatArea}>
        {messages.map((msg, idx) => {
          const isMe = msg.user._id === user._id || msg.user === user._id;
          return (
            <div key={msg._id || idx} className={`${styles.messageWrapper} ${isMe ? styles.mine : styles.theirs}`}>
              {!isMe && <span className={styles.sender}>{msg.username}</span>}
              <div className={styles.messageBubble}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <div className={styles.emojiRow}>
          {quickEmojis.map(e => (
            <span key={e} onClick={() => setInputText(prev => prev + e)} className={styles.quickEmoji}>
              {e}
            </span>
          ))}
        </div>
        <form onSubmit={handleSend} className={styles.inputArea}>
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.sendBtn} disabled={!inputText.trim()}>
            ➤
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatTab;
