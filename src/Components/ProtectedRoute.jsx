/**
 * Protected Route Component
 * Location: src/components/ProtectedRoute.jsx
 * 
 * Redirects to login if user is not authenticated
 */

import { Navigate } from 'react-router-dom';
import { tokenManager } from '../tokenManager/tokenManger';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = tokenManager.isAuthenticated();
  
  if (!isAuthenticated) {
    // Clear any invalid tokens
    tokenManager.clearTokens();
    
    // Redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
