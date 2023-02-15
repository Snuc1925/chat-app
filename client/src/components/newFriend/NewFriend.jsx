import React from 'react';
import { useState, useRef } from 'react';
import "./newFriend.css"
import CloseIcon from '@mui/icons-material/Close';
import LoadImage from '../../service/LoadImage';
import DoneIcon from '@mui/icons-material/Done';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const users = [
    {
        id: 1,
        name: "Manh",
        profileImage: "defaultAvatar",
        email: "abc@gmail.com",
    }
];

export default function NewFriend({isOpen, setIsOpen, friendsList}) {
    const { user } = useContext(AuthContext);
    const [searchUser, setSearchUser] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [error, setError] = useState(false);
    const email = useRef();

    const handleSearch = async (e) => {
        e.preventDefault();
        console.log(friendsList);
        console.log(email.current.value);

        await axios.get(`/user/email/${email.current.value}`)
        .then((res) => {
            const userData = res.data;
            if (userData) {
                setError(false);
                setSearchUser(userData);
                const ckUser = friendsList.find((fr) => fr.id === userData.id);
                if (ckUser) setIsFriend(true);
                else setIsFriend(false);
            } else {
                setSearchUser(null);
                setError(true);
            }
        })
    }

    const handleSendRequest = async (e) => {
        e.preventDefault();
        setIsOpen(false);

        await axios.put(`/user/friendrequests/add/${searchUser.id}`, { id: user.id });
    }   

    return (
        <>      
            <div className="newFriendModal" style={{display: (isOpen ? "block" : "none")}}>
                <div className="modalContent">
                    <div className="modalTop">
                        <div className="modalTopText">Add new friend</div>
                        <div className="modalTopClose" onClick={() => setIsOpen(false)}>
                            <CloseIcon/>
                        </div>
                    </div>
                    <hr/>
                    <div className="modalMain">   
                        <label>Email Address: </label>
                        <input type="email" ref = {email}></input>
                    </div>

                    { searchUser 
                        ? 
                        <div className="searchUserItem">
                            <span className="searchUserProfile">
                                <span className = "searchUserImg">
                                    <LoadImage path = {searchUser.profileImage} size = "50px"/>
                                </span>
                                <span className = "searchUserName">{searchUser.name}</span>
                            </span>
                            {
                                !isFriend 
                                ? 
                                    <button className="requestButton" onClick={handleSendRequest}>Add friend</button>
                                :
                                    <button className="requestButton">
                                        <DoneIcon/> Friend
                                    </button>
                            }
                        </div>
                        :
                        <></>
                    }

                    <div className="modalError" style={{display: (error ? "block" : "none")}}>
                        User not found!
                    </div>

                    <div className="modalHandle">
                        <button className="modalHandleButton modalCancel" onClick={() => setIsOpen(false)}>Cancel</button>
                        <button className="modalHandleButton modalSearch" onClick={(e) => handleSearch(e)}>Search</button>
                    </div>
                </div>
            </div>
        </>
    )
}