import React from 'react';
import { format } from 'timeago.js';
import LoadImage from '../../service/LoadImage';
import "./message.css"

export default function Message({message, own, sender}) {
    return (
        <div className={message.own ? "message own" : "message"}>
            <div className="messageImg">
                {/* <LoadImage path={sender.profileImage} size="20px"/> */}
                <LoadImage path={message.own ? "captain" : "liumen"} size="40px"/>
            </div>                        
            <p className="messageText">{message.text}</p>
            {/* <div className="messageBottom">{format(message.createdAt)}</div> */}
        </div>

    )
}