import React from 'react';
import LoadImage from '../../service/LoadImage';

export default function Conversation({ conversation }) {
    return (
        <div className="conversation">
            <span className='conversation-img'>
                <LoadImage path={conversation.chatUser.profileImage} size = "40px" />
            </span>
            <span className="conversation-name">{conversation.chatUser.name}</span>
        </div>
    )
}