import React, { useEffect } from "react";
import { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import LoadImage from "../../service/LoadImage";
import "./friends.css";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import NewFriend from "../../components/newFriend/NewFriend";
import { getUserData } from "../../apiCalls.js";
import { format } from "timeago.js";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

// const frData = [
//     {
//         id: "1",
//         name: "Mai Manh",
//         profileImage: "defaultAvatar"
//     },
//     {
//         id: "2",
//         name: "Messi",
//         profileImage: "defaultAvatar"
//     },
//     {
//         id: "3",
//         name: "Neymar",
//         profileImage: "defaultAvatar"
//     },
// ]

// const frList = [
//     {
//         id: "10",
//         name:  "Pedri",
//         profileImage: "defaultAvatar",
//         createdAt: "2020-02-14",
//     },
//     {
//         id: "11",
//         name:  "Alba",
//         profileImage: "defaultAvatar",
//         createdAt: "2020-02-14",
//     },
//     {
//         id: "12",
//         name:  "Gavi",
//         profileImage: "defaultAvatar",
//         createdAt: "2020-02-14",
//     },
// ]

import { io } from "socket.io-client"

export default function Friends() {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [isAddingFriend, setIsAddingFriend] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [arrivalReq, setArrivalReq] = useState(null);
    const socket = useRef();

    // useEffect(() => {
    //     // setTimeout(() => {
    //     //     setArrivalReq({senderId: "63dbf1734b07b9c969e92e40"});
    //     //     // console.log("hello");
    //     // }, 2000);
    //     setArrivalReq({senderId: "63dbf1734b07b9c969e92e40"});
    // }, [])

    useEffect(() => {
        if (!arrivalReq) return;

        const updateData = async () => {
            const today = new Date();

            const data = {
                id: arrivalReq.senderId,
                createdAt: today.toISOString()
            }
    
            await axios.put(`/user/friendrequests/add/${user.id}`, data);
            
            dispatch({ type: "ADD_FRIEND_REQUEST", payload: data});
        }

        updateData();
    }, [arrivalReq])

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/user/friends/${user.id}`)
            .then(async (res) => {
                const friendsData = await Promise.all(
                    res.data.map(async (friendId) => {
                        const friendData = await getUserData(user, friendId);
                        return {
                            id: friendId, 
                            profileImage: friendData.profileImage,
                            name: friendData.name,
                        }
                    })
                )
                setFriends(friendsData.reverse());
            })
        }

        fetchData();
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`/user/friendrequests/${user.id}`)
            .then(async (res) => {
                const friendRequestsData = await Promise.all(
                    res.data.map(async (fr) => {
                        const userData = await getUserData(user, fr.id);
                        return {
                            id: fr.id,
                            profileImage: userData.profileImage,
                            name: userData.name,
                            createdAt: fr.createdAt
                        }
                    })
                )
                
                setFriendRequests(friendRequestsData.reverse());
            })
        }

        fetchData();
    }, [user])

    const handleAcceptRequest = async (e, userId) => {
        e.preventDefault();

        await axios.put(`/user/friendrequests/delete/${user.id}`,  { id: userId});

        const data = friendRequests.find((fr) => fr.id === userId);

        const newFriendRequests = friendRequests.filter((fr) => fr.id !== userId);
        setFriendRequests(newFriendRequests);

        await axios.put(`/user/friends/add`, { user1: userId, user2: user.id});
        
        const newFriend = {
            id: data.id,
            profileImage: data.profileImage,
            name: data.name,
        }

        setFriends([newFriend, ...friends]);
        // dispatch({type: "ADD_FRIEND",  payload: userId});
    }

    const handleDeleteRequest = async (e, userId) => {
        e.preventDefault();

        await axios.put(`/user/friendrequests/delete/${user.id}`, { id: userId });
        // dispatch({type: "REMOVE_FRIEND_REQUEST", payload: userId});
    }

    return (
        <>
            <NewFriend isOpen = {isAddingFriend} setIsOpen={setIsAddingFriend} friendsList = {friends}/>
            <Sidebar/>
            <div className = "friend-wrapper">
                <div className = "friends-list-wrapper">
                    <div className = "friend-add"  onClick={() => setIsAddingFriend(true)}>
                        <span className = "friend-add-icon">
                            <PersonAddIcon/> 
                        </span>

                        <span className = "friend-add-text">
                            Add friend
                        </span>
                    </div>
                    {/* <button onClick={() => navigate(`/profile/${user.id}`)}>Profile</button> */}
                    <hr/>

                    <div className = "friends-list">
                        <div className = "friends-list-text">Friends ({friends.length}) </div>
                        <div>
                            { friends.map((friend) => (
                                <div className="friend-item">
                                    <div className="friend-item-profile">
                                        <span className = "friend-item-img">
                                            <LoadImage path = {friend.profileImage} size = "50px"/>
                                        </span>
                                        <span className = "friend-item-name">{friend.name}</span>
                                    </div>
                                    <div className="friend-item-option">
                                        <MoreHorizIcon/>
                                        {/* <div className="friend-item-option-list">
                                            <div className="option-item">Remove friend</div>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                <div className = "friend-requests-wrapper">
                    <div className="friend-requests-text">
                        Friend requests ({friendRequests.length})
                    </div>
                    <div className="friend-requests">
                        { friendRequests.map((fr) => (
                            <div className="friend-request-item">
                                {/* <span>
                                    <LoadImage path={fr.profileImage} size = "40px"/>
                                </span>
                                <span>{fr.name}</span> */}
                                <div className="friend-request-profile">
                                    <span className = "friend-request-img">
                                        <LoadImage path = {fr.profileImage} size = "50px"/>
                                    </span>
                                    <span className = "friend-request-name">{fr.name}</span>
                                </div>
                                
                                <div className="friend-request-right">
                                    <div className="friend-request-time">{format(fr.createdAt)}</div>
                                    <div className="friend-request-handle">
                                        <button className="friend-request-button friend-request-accept" onClick={(e) =>  handleAcceptRequest(e, fr.id)}>Accept</button>
                                        <button className="friend-request-button friend-request-delete" onClick={(e) => handleDeleteRequest(e, fr.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
        </>
    )
}