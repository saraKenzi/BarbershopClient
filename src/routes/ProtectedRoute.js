import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const currentUser = useSelector(state => state.user.currentUser);

  return currentUser ? <Component {...rest} /> : <Navigate to="/logIn" />;
};

export default ProtectedRoute;
