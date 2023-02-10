import React from "react";
import {
  BrowserRouter as Router,
  Route, 
  Routes,
  Navigate,
} from 'react-router-dom';

import { useContext } from "react";

import Profile from "./pages/profile/Profile";
import SignUp from "./pages/signup/SignUp";
import LogIn from "./pages/login/LogIn";
import { AuthContext } from "./contexts/AuthContext";
import Friends from "./pages/friends/Friends";
import Messenger from "./pages/messenger/Messenger";

import "./App.css"

export default function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route exact path = '/' element= { user ? <Navigate to = {`/profile`}/> : <Navigate to = "/login"/>} />
        <Route exact path = "/signup" element= { user ? <Navigate to = {`/profile`}/> : <SignUp/>} />
        <Route exact path = "/login" element= { user ? <Navigate to = {`/profile`}/> : <LogIn/>} />
        <Route exact path = "/profile" element = { !user ? <Navigate to = '/login'/> : <Profile/>}/>
        <Route exact path = "/friends" element = { user ? <Friends/> : <Navigate to = '/login'/>}/>
        <Route exact path = "/messenger" element = {user ? <Messenger/> : <Navigate to = '/login'/>}/>
      </Routes>
    </Router>
  )
}