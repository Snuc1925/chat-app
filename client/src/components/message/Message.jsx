import React from 'react';
import LoadImage from '../../service/LoadImage';
import "./message.css"

export default function Message({message, own, sender}) {
    return (
        <div className={own ? "message own" : "message"} style={{display: (message.text ? "flex" : "none")}}>
            <div className="messageImg">
                <LoadImage path={sender.profileImage} size="40px"/>
            </div>                        
            <p className="messageText">{message.text}</p>
        </div>

    )
}