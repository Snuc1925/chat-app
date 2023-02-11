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
    const scrollRef = useRef();
    
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (message) => {
            setArrivalMessage(message);
        });
    }, [])

    useEffect(() => {
        if (!arrivalMessage) return;
        const newConversations = conversations.filter(c => c.chatId !== arrivalMessage.chatId);

        console.log(newConversations);

        const topChat = {
            chatId: arrivalMessage.chatId,
            chatUser: arrivalMessage.sender,
            lastMessage: {
                own: false,
                text: arrivalMessage.text,
                createdAt: Date.now()
            },
            unseen: {
                own: true,
                count: arrivalMessage.unseenCount
            }
        }

        setConversations([topChat, ...newConversations]);

        const newMessageData = {
            conversationId: arrivalMessage.chatId,
            senderId: arrivalMessage.sender.id,
            text: arrivalMessage.text
        }

        if (currentChat && arrivalMessage.chatId === currentChat.chatId) {
            setMessages([...messages, newMessageData])
        }
    }, [arrivalMessage])

    useEffect(() => {
        socket.current.emit("addUser", user.id);
    }, [user]);

    useEffect(() => {
        const getConversations = async () => {
            try {
                await axios.get(`/conversation/${user.id}`)
                .then((res) => {
                    // console.log(res.data);
                    setConversations(res.data);
                })
            } catch (err) {
                console.log(err);
            }
        }
        getConversations();
    }, [user]);

    useEffect(() => {
        // console.log(currentChat);
        const getMessages = async () => {
            try {
                // console.log(currentChat.chatId);
                await axios.get('/message/' + currentChat.chatId). 
                then((res) => {
                    // console.log(res.data);
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

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

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
        
        const newConversations = conversations.filter((c) => c.chatId !== currentChat.chatId);
        const newCurrentChat = {
            chatId: currentChat.chatId,
            chatUser: currentChat.chatUser,
            lastMessage: {
                own: true,
                text: newMessage,
                createdAt: Date.now()
            },
            unseen: {
                own: false,
                count: currentChat.unseen.count + 1
            }
        }        
        
        // await axios.put(`/conversation/unseen/${currentChat.chatId}`, {
        //     unseen: {
        //         userId: currentChat.chatUser.id,
        //         count: currentChat.unseen.count + 1
        //     }
        // })


        socket.current.emit("sendMessage", {
            chatId: currentChat.chatId,
            sender: {
                id: user.id,
                name: user.name,
                profileImage: user.profileImage
            },
            receiverId: currentChat.chatUser.id,
            text: newMessage,
            unseenCount: currentChat.unseen.count + 1
        })
        
        setCurrentChat(newCurrentChat);
        setConversations([newCurrentChat, ...newConversations]);
        setNewMessage("");
    }

    const handleSetChat = async (c) => {
        setCurrentChat(c);

        if (c.unseen.count) {
            const newConversations = conversations.map((con) => {
                if (con.chatId === c.chatId) {
                    return {
                        chatId: con.chatId,
                        chatUser: con.chatUser,
                        lastMessage: con.lastMessage,
                        unseen: {
                            own: false,
                            count: 0
                        }
                    }
                } else {
                    return con;
                }
            })
            setConversations(newConversations);
    
            // await axios.put(`/conversation/unseen/${currentChat.chatId}`, {
            //     unseen: {
            //         userId: currentChat.chatUser.id,
            //         count: 0
            //     }
            // })
        }

    }

    return (
        <>
            <div className = "messenger-wrapper">
                <div className = "conversation-list">
                    {conversations.map((c) => (
                        <div onClick={() => handleSetChat(c)}>
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
                                        <div ref={scrollRef}>
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