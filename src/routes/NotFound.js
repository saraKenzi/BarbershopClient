import React from 'react';
import './routesCSS/notFound.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';


const NotFound = () => {

    const navigate = useNavigate();
    const backToLogin = () => {
        navigate('/login');
    }

    return (<>
        <div className="not-found-container">
            <img src="../../pic/NotFound.png" alt="notFound" className="not-found-image" />
        </div>

        <Button variant="contained"
            sx={{ minWidth: "20%", mb: 3, mt: 2, zIndex: 2 }}
            onClick={backToLogin}>
            בחזרה לדף הבית
        </Button>
    </>
    );
};

export default NotFound;