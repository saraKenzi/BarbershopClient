import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { userOut } from './userSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Profile = () => {
    let dispatch = useDispatch();
    let navigate = useNavigate();
    const userString = localStorage.getItem("currentUser");
    const user = JSON.parse(userString);




   

    return (<div>
        <h3>שלום {user.firstName}</h3>
        <p><b>אלו הם פרטיך השמורים במערכת:</b></p>
        <p>שם פרטי: {user.firstName}</p>
        <p>שם משפחה: {user.lastName}</p>
        <p>שם משתמש: {user.userName}</p>
        <p>טלפון:{user.phone}</p>
        

    </div>

    );
}

export default Profile;