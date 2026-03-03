import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const ProtectedRoute = ({ children }) => {
    const isAdminLoggedIn = useStore((state) => state.isAdminLoggedIn);
    const location = useLocation();

    if (!isAdminLoggedIn) {
        // Redirect them to the /admin/login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience.
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
