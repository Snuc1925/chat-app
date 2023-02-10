import React from 'react';
import { format } from 'timeago.js';
import LoadImage from '../../service/LoadImage';

export default function Message({message, own, sender}) {
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <div className="messageImg">
                    <LoadImage path={sender.profileImage} size="20px"/>
                </div>
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>

    )
}