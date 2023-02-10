import React from "react";
import axios from "axios";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "../../App.css";
import LoadImage from "../../service/LoadImage";
import Messenger from "../messenger/Messenger";

export default function Profile () {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        dispatch({ type: "LOGOUT"});
        navigate('/login');
    }

    return (
       
        <>
            <LoadImage path = {user.profileImage} size="100px"/>
            <h2>{user.name}</h2>
            <button onClick = {(e) => handleLogout(e)}>Logout</button>
            <button onClick= {(e) => navigate('/friends')}>Friends</button>
            <button onClick = {(e) => navigate('/messenger')}>Messenger</button>
        </>
    )
}