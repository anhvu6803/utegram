import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const token = localStorage.getItem('token');
    const tokenCreationTime = localStorage.getItem('tokenCreationTime');

    const isTokenExpired = () => {
        if (!token || !tokenCreationTime) return true; 

        const currentTime = new Date().getTime();
        const expirationTime = 5 * 60 * 1000; 

        return currentTime - tokenCreationTime > expirationTime; 
    };

    return token && !isTokenExpired() ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
