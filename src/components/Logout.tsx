import React from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate(); 

    React.useEffect(() => {
        const handleLogout = () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
            navigate('/login');
        };

        handleLogout();
    }, [navigate]); 

    return null; 
};

export default Logout;
