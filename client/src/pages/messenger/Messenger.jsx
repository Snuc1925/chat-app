import React from 'react';
import { useContext, useState, useEffect, useRef } from 'react';
import Conversation from '../../components/conversation/Conversation';
import { AuthContext } from '../../contexts/AuthContext';
import Message from '../../components/message/Message';
import { io } from "socket.io-client"
import axios from 'axios';

export default function Messenger() {
    const [messages, setMessages] = useState([]);
    const [newMessage,  setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const socket = useRef();
    const { user } = useContext(AuthContext);
    
    // useEffect(() => {
    //     socket.current = io("ws://localhost:8900");
    //     socket.current.on("getMessage", (data) => {
    //         setArrivalMessage({
    //             senderId: data.senderId,
    //             text: data.text,
    //             createdAt: Date.now()
    //         });
    //     });
    // }, [])

    // useEffect(() => {

    // }, [arrivalMessage, currentChat])

    useEffect(() => {
        const getConversations = async () => {
            try {
                await axios.get(`/conversation/${user.id}`)
                .then((res) => {
                    console.log(res.data);
                    setConversations(res.data);
                })
            } catch (err) {
                console.log(err);
            }
        }
        getConversations();
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                console.log(currentChat.chatId);
                await axios.get('/message/' + currentChat.chatId). 
                then((res) => {
                    console.log(res.data);
                    setMessages(res.data);
                })
            } catch (err) {
                console.log(err);
            }
        }
        if (currentChat) {
            getMessages();
        }
    }, [currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            senderId: user.id,
            text: newMessage,
            conversationId: currentChat.chatId
        }

        await axios.post('/message', message)
        .then((res) => {
            setMessages([...messages, res.data]);
        })
        setNewMessage("");
    }

    return (
        <>
            <div className = "messenger-wrapper">
                <div className = "conversation-list">
                    {conversations.map((c) => (
                        <div onClick={() => setCurrentChat(c)}>
                            <Conversation conversation = {c}/>
                        </div>
                    ))}                    
                </div>
                <div className = "main-conversation">
                    { currentChat
                        ? 
                            <>
                                <div className="chatBoxTop">
                                    {messages.map((m) => (
                                        <div>
                                            <Message 
                                                message={m} 
                                                own={m.senderId === user.id} 
                                                sender={m.senderId === user.id ? user : currentChat.chatUser} 
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <textarea
                                        className="chatMessageInput"
                                        placeholder="write something..."
                                        onChange={(e) => {setNewMessage(e.target.value)}}
                                        value={newMessage}
                                        onSubmit
                                    ></textarea>
                                    <button className="chatSubmitButton" onClick={handleSubmit}>
                                        Send
                                    </button>
                                </div>                                
                            </>
                        :
                            <div className="noConversationText">Open a conversation to start a chat</div>
                    }
                </div>
                <div className = "messenger-right">
                    
                </div>
            </div>
        </>
    )
    
}