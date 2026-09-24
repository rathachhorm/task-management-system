import { Navigate, Outlet } from 'react-router-dom';
import LoginService from '../services/login.service';

const PrivateRoute = () => {
    const currentUser = LoginService.getCurrentUser();

    return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
