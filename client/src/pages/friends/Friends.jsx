import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

export default function Friends() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        if (user.friends) {
            user.friends.map(async (friendId) => {
                console.log(friendId);
                const res = await axios.get(`/user/${friendId}`, {
                    headers: {
                        'x-access-token': user.accessToken,
                    }
                })
                setFriends([...friends, res.data]);
            })
        }
    }, [user]);

    return (
        <>
            <div className = "friends-wrapper">
                <div className = "friends-list">
                    <button onClick={() => navigate(`/profile/${user.id}`)}>Profile</button>
                    <div>Friends List ({friends.length}) </div>
                    <ul>
                        { friends.map((friend) => (
                            <li>{friend.name}</li>
                        ))}
                    </ul>
                </div>
                <div className = "friend-request">
                    Friend request
                </div>
                <div className = "friends-new">
                    Add new friend
                </div>
            </div>
        </>
    )
}