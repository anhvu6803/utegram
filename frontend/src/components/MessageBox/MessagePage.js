import React, { useState, useRef, useEffect } from 'react';
import './MessagePage.css';  
import imgava from '../../assets/avatar_default.jpg'
import OptionBar from '../../components/OptionBar/OptionBar'
const MessagePage = () => {
    const [contacts, setContacts] = useState([
        { id: 1, name: 'Anh Vũ', profilePic: imgava },
        { id: 2, name: 'Nhật Nguyên', profilePic: imgava },

    ]);

    const predefinedMessages = {
        1: [{ content: 'Hello', sender: 'me' }, { content: 'Hi', sender: 'Anh Vũ' }],
        2: [{ content: 'Hi', sender: 'me' }, { content: 'Alo', sender: 'Nhật Nguyên' }],
    };

    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef(null);

    const handleChatClick = (contact) => {
        setActiveChat(contact);
        setMessages(predefinedMessages[contact.id] || []);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = { content: newMessage, sender: 'me' };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="messenger-page">
            <OptionBar></OptionBar>
            <div className="contacts-sidebar">
                <h3>Chats</h3>
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact.id} onClick={() => handleChatClick(contact)} className={activeChat && activeChat.id === contact.id ? 'active-contact' : ''}>
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
