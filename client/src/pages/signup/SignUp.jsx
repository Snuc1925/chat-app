import React from 'react';
import axios from 'axios';
import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function Signup() {
    const navigate = useNavigate();
    const email = useRef();
    const name = useRef();
    const password = useRef();
    const {  user, isFetching, error, dispatch } = useContext(AuthContext);

    const handleSubmitForm = async (e) => { 
        e.preventDefault();
        dispatch( { type: 'AUTH_START'} );
        const data = {
            email: email.current.value,
            password: password.current.value,
            name: name.current.value,
        }

        try {
            const res = await axios.post('http://localhost:8000/api/auth/register', data);
            dispatch ( {type: "AUTH_SUCCESS", payload: res.data});
            navigate('/login');
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
                <label>Name: </label>
                <input ref = {name} type="text" disabled={isFetching}/>
                <br/>
                <button type="submit">Sign Up</button>
                <button onClick={() => navigate('/login')}>Log In</button>
                <div style={{display: (isFetching ? "block" : "none")}}>....Loading</div>                                                              
                <div>{error}</div>
            </form>
        </>
    )
}