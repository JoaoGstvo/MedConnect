// hooks/useCurrentUser.js
import { useState, useEffect } from 'react';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const updateUser = (userData) => {
    setCurrentUser(userData);
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  return {
    currentUser,
    loading,
    updateUser
  };
};