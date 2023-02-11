import React from 'react';
import LoadImage from '../../service/LoadImage';
import { format } from 'timeago.js';

export default function Conversation({ conversation }) {
    // console.log(conversation);
    return (
        <div className="conversation">
            <div className="conversation-top">
                <span className='conversation-img'>
                    <LoadImage path={conversation.chatUser.profileImage} size = "40px" />
                </span>
                <span className="conversation-name">{conversation.chatUser.name}</span>
                <span>{format(conversation.lastMessage.createdAt)}</span>
                {
                    conversation.unseen.own ?
                    <span>{conversation.unseen.count}</span>
                    :
                    <span></span>
                }
            </div>
            <div className='conversation-bottom'>
                <span>{conversation.lastMessage.own ? "You: " : ""} {conversation.lastMessage.text}</span>
            </div>
        </div>
    )
}