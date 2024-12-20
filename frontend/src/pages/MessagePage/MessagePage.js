import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import './MessagePage.css';
import imgava from '../../assets/avatar_default.jpg';
import OptionBar from '../../components/OptionBar/OptionBar';
import { AuthContext } from '../../shared/context/auth-context';

const socket = io('http://localhost:5000');

const MessagePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  const [unreadContacts, setUnreadContacts] = useState([]);

  const fetchContacts = async () => {
    try {
      const allContactsResponse = await fetch(`http://localhost:5000/api/users/contacts/${userId}`);
      if (!allContactsResponse.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const allContactsData = await allContactsResponse.json();
      setContacts(allContactsData);

      const unreadContactsResponse = await fetch(`http://localhost:5000/api/messages/unread/?userId=${userId}`);
      if (!unreadContactsResponse.ok) {
        throw new Error('Failed to fetch unread contacts');
      }
      const unreadContactsData = await unreadContactsResponse.json();
      setUnreadContacts(unreadContactsData);

      if (username) {
        const contact = allContactsData.find(contact => contact.username === username);
        if (contact) {
          handleChatClick(contact);
        } else {
          console.error('No user found with the username:', username);
        }
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  };

  useEffect(() => {
    fetchContacts();

    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === message.senderId || contact._id === message.recipientId
            ? { 
                ...contact, 
                lastMessage: message, 
                unreadMessages: contact._id !== message.senderId && contact._id !== message.recipientId 
                  ? contact.unreadMessages + 1 
                  : contact.unreadMessages 
              }
            : contact
        )
      );
    });

    return () => {
      socket.off('newMessage');
    };
  }, [userId, username]);

  const handleChatClick = async (contact) => {
    setActiveChat(contact);
    setIsCollapsed(true);

    try {
      const markAsReadResponse = await fetch('http://localhost:5000/api/messages/markMessagesAsRead', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId1: userId,
          userId2: contact._id, 
        }),
      });

      if (!markAsReadResponse.ok) {
        throw new Error('Failed to mark messages as read');
      }
      const result = await markAsReadResponse.json();
      console.log(result.message);
      const response = await fetch(`http://localhost:5000/api/messages/${userId}/${contact._id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);

      setContacts((prevContacts) =>
        prevContacts.map((prevContact) =>
          prevContact._id === contact._id
            ? { ...prevContact, unreadMessages: 0 }
            : prevContact
        )
      );

      socket.emit('joinRoom', { userId, otherUserId: contact._id });
      navigate(`/messages/${contact.username}`);
      fetchContacts(); 
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
        {unreadContacts.length > 0 && (
          <>
            <h3>Tin nhắn mới</h3>
            <ul>
              {unreadContacts.map((contact) => (
                <li
                  key={contact._id}
                  onClick={() => handleChatClick(contact)}
                  className={activeChat && activeChat._id === contact._id ? 'active-contact' : ''}>
                  <img className="profile-pic" src={contact.avatar || imgava} alt={contact.fullname} />
                  <div className="contact-info">
                    <div className="contact-name">{contact.fullname}</div>
                    <div className="contact-username">@{contact.username}</div>
                  </div>
                  {contact.unreadMessages > 0 && (
                    <span className="unread-dot">
                      {contact.unreadMessages}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
        <h3>Liên hệ</h3>
        <ul>
          {contacts.length > 0 ? (
            contacts
              .filter(contact => !unreadContacts.some(unreadContact => unreadContact._id === contact._id))  // Filter out unread contacts
              .map((contact) => (
                <li
                  key={contact._id}
                  onClick={() => handleChatClick(contact)}
                  className={activeChat && activeChat._id === contact._id ? 'active-contact' : ''}>
                  <img className="profile-pic" src={contact.avatar || imgava} alt={contact.fullname} />
                  <div className="contact-info">
                    <div className="contact-name">{contact.fullname}</div>
                    <div className="contact-username">@{contact.username}</div>
                  </div>
                  {contact.unreadMessages > 0 && (
                    <span className="unread-dot">
                      {contact.unreadMessages}
                    </span>
                  )}
                </li>
              ))
          ) : (
            <li>No contacts available</li>
          )}
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
              {messages && messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className={msg.senderId === userId ? 'message sent' : 'message received'}>
                    {msg.content}
                  </div>
                ))
              ) : (
                <div>No messages yet</div>
              )}
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
