import React, { useState, useRef, useEffect } from 'react';
import './MessagePage.css';
import imgava from '../../assets/avatar_default.jpg';
import OptionBar from '../../components/OptionBar/OptionBar';

const MessagePage = () => {
    // State for contacts and active chat
    const [contacts, setContacts] = useState([
        { id: 1, name: 'Anh Vũ', profilePic: imgava },
    ]);

    // Predefined messages
    const predefinedMessages = {
        1: [{ content: 'Hello', sender: 'me' }, { content: 'Hi', sender: 'Anh Vũ' }],
    };

    // Manage state for active chat, messages, new message, and scroll
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);

    // State for collapsing the sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);  // New state for controlling collapse

    // Handle chat selection
    const handleChatClick = (contact) => {
        setActiveChat(contact);
        setMessages(predefinedMessages[contact.id] || []);
        setIsCollapsed(true);  // Collapse sidebar when a chat is selected
    };

    // Handle sending a new message
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = { content: newMessage, sender: 'me' };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    // Scroll to the bottom of the chat when new messages are added
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending a message by pressing Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="messenger-page">
            {/* Pass isCollapsed and setIsCollapsed to OptionBar */}
            <OptionBar pages="message" isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            <div className={`contacts-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                <h3>Chats</h3>
                <ul>
                    {contacts.map((contact) => (
                        <li
                            key={contact.id}
                            onClick={() => handleChatClick(contact)}
                            className={activeChat && activeChat.id === contact.id ? 'active-contact' : ''}
                        >
                            <img className="profile-pic" src={contact.profilePic} alt={contact.name} />
                            <div className="contact-info">
                                <div className="contact-name">{contact.name}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-window">
                {activeChat ? (
                    <div className="chat-box">
                        <div className="chat-header">
                            <img src={activeChat.profilePic} alt={activeChat.name} className="profile-pic" />
                            <span className="contact-name">{activeChat.name}</span>
                        </div>

                        <div className="chat-messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={msg.sender === 'me' ? 'message sent' : 'message received'}>
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
