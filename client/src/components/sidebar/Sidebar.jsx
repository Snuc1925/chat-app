import React from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useContext } from 'react';
import LoadImage from '../../service/LoadImage';
import "./sidebar.css"
import MessageIcon from '@mui/icons-material/Message';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="sidebarWrapper">
            <div className="sidebarAvatar">
                <LoadImage path={user.profileImage} size="60px"/>
            </div>
            <div className="sidebarMessage" onClick={() => navigate('/messenger')}>
                <MessageIcon sx={{ fontSize: 50 }}/>
            </div>

            <div className="sidebarContact" onClick={() => navigate('/friends')}>
                <ContactPageIcon sx={{ fontSize: 50}}/>
            </div>
        </div>
    )
}