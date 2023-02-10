import React from "react";
import { useReducer, createContext, useEffect } from "react";
import AuthReducer from "../reducers/AuthReducer";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isFetching: false,
    error: ""
}

export const AuthContext = createContext(INITIAL_STATE);

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user));
    }, [state.user])

    return (
        <AuthContext.Provider 
            value = {{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}