import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './MessagePage.css';
import imgava from '../../assets/avatar_default.jpg';
import OptionBar from '../../components/OptionBar/OptionBar';

const socket = io('http://localhost:5000');

const MessagePage = () => {
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/except/${userId}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await response.json();
        setContacts(usersData);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    fetchContacts();

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === message.senderId || contact._id === message.recipientId
            ? { ...contact, lastMessage: message }
            : contact
        )
      );
    });

    return () => {
      socket.off('newMessage');
    };
  }, [userId]);

  const handleChatClick = async (contact) => {
    setActiveChat(contact);
    setIsCollapsed(true);

    try {
      const response = await fetch(`http://localhost:5000/api/messages/${userId}/${contact._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);

      socket.emit('joinRoom', { userId, otherUserId: contact._id });
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      const newMsg = {
        senderId: userId,
        recipientId: activeChat._id,
        content: newMessage,
      };

      try {
        const response = await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMsg),
        });

        if (response.ok) {
          const savedMessage = await response.json();
          setMessages((prevMessages) => [...prevMessages, savedMessage]);
          setNewMessage('');
          socket.emit('sendMessage', savedMessage);

          setContacts((prevContacts) =>
            prevContacts.map((contact) =>
              contact._id === activeChat._id ? { ...contact, lastMessage: savedMessage } : contact
            )
          );
        } else {
          console.error('Failed to send message:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messenger-page">
      <OptionBar pages="message" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`contacts-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <h3>Chats</h3>
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact._id}
              onClick={() => handleChatClick(contact)}
              className={activeChat && activeChat._id === contact._id ? 'active-contact' : ''}
            >
              <img className="profile-pic" src={contact.avatar || imgava} alt={contact.fullname} />
              <div className="contact-info">
                <div className="contact-name">{contact.fullname}</div>
                <div className="contact-username">@{contact.username}</div> 
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-window">
        {activeChat ? (
          <div className="chat-box">
            <div className="chat-header">
              <img src={activeChat.avatar || imgava} alt={activeChat.fullname} className="profile-pic" />
              <span className="contact-name">{activeChat.fullname}</span>
            </div>

            <div className="chat-messages">
              {Array.isArray(messages) && messages.map((msg, index) => (
                <div key={index} className={msg.senderId === userId ? 'message sent' : 'message received'}>
                  {msg.content}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                placeholder="Aa"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div className="empty-chat">Select a contact to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
