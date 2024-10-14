import React from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate(); 

    React.useEffect(() => {
        const handleLogout = () => {
            localStorage.removeItem('token');
            navigate('/login');
        };

        handleLogout();
    }, [navigate]); 

    return null; 
};

export default Logout;
