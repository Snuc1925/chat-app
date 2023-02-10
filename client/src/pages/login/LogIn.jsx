import React from 'react';
import axios from 'axios';
import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function LogIn() {
    const navigate = useNavigate();
    const email = useRef();
    const password = useRef();
    const {  user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleSubmitForm = async (e) => { 
        e.preventDefault();
        dispatch( { type: 'AUTH_START'} );
        const data = {
            email: email.current.value,
            password: password.current.value,
        }

        try {
            const res = await axios.post('http://localhost:8000/api/auth/login', data);
            console.log(res.data);
            dispatch ( {type: "AUTH_SUCCESS", payload: res.data});
        } catch (err) {
            dispatch ( {type: "AUTH_FAILURE", payload: err});
        }
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmitForm(e)}>
                <label>Email: </label>
                <input ref = {email} type="email" disabled={isFetching}/>
                <br/>
                <label>Password: </label>
                <input ref = {password} type="password" disabled={isFetching}/>
                <br/>
                <button type="submit">Log In</button>
                <button onClick={() => navigate('/signup')}>Sign up</button>
                <div style={{display: (isFetching ? "block" : "none")}}>....Loading</div>                                                              
                <div>{error}</div>
            </form>
        </>
    )
}