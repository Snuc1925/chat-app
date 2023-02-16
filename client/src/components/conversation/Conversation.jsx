import React from 'react';
import LoadImage from '../../service/LoadImage';
import { format } from 'timeago.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en'

import "./conversation.css"

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

export default function Conversation({ conversation }) {
    console.log(conversation.lastMessage);
    return (
        <div className="conversation">
            <div className="conversation-left">
                <LoadImage path={conversation.chatUser.profileImage} size = "50px" />
            </div>

            <div className="conversation-main">
                <span className="conversation-name">{conversation.chatUser.name}</span>

                {
                    (conversation.lastMessage.own !== null)
                    ? 
                        <div className='conversation-text'>
                            <span>{conversation.lastMessage.own ? "You: " : ""} {conversation.lastMessage.text}</span>
                        </div>
                    :
                        <div></div>
                }
            </div>
            
            <div className="conversation-right">
                {
                    (conversation.lastMessage.own !== null)
                    ?
                        <span>{timeAgo.format(conversation.lastMessage.createdAt, 'mini-minute-now')}</span>
                    :
                        <span></span>
                }
            </div>
        </div>
    )
}