import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.api.js';
import { userApi } from '../api/user.api.js';
import { getAuthToken } from '../api/client.js';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'customer_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => getAuthToken());
  const [isLoading, setIsLoading] = useState(true);

  // Sync user changes to localStorage
  const saveUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, []);

  // Fetch full profile if token exists on mount
  useEffect(() => {
    const currentToken = getAuthToken();
    if (currentToken) {
      setToken(currentToken);
      userApi
        .getProfile()
        .then((profile) => {
          if (profile) saveUser(profile);
        })
        .catch(() => {
          // Keep cached profile if offline
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('customer:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('customer:unauthorized', handleUnauthorized);
    };
  }, [saveUser]);

  const login = async (email, password) => {
    const res = await authApi.loginEmail({ email, password });
    if (res?.success) {
      setToken(res.token);
      saveUser(res.customer);
      return res.customer;
    }
    throw new Error(res?.error?.message || 'Login failed');
  };

  const loginWithGoogle = async (idToken) => {
    const res = await authApi.loginGoogle(idToken);
    if (res?.success) {
      setToken(res.token);
      saveUser(res.customer);
      return res.customer;
    }
    throw new Error(res?.error?.message || 'Google Login failed');
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    if (res?.success) {
      setToken(res.token);
      saveUser(res.customer);
      return res.customer;
    }
    throw new Error(res?.error?.message || 'Registration failed');
  };

  const logout = () => {
    authApi.logout();
    setToken(null);
    saveUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await userApi.updateProfile(profileData);
    if (updated) saveUser(updated);
    return updated;
  };

  const addAddress = async (addressData) => {
    const updated = await userApi.addAddress(addressData);
    if (updated) saveUser(updated);
    return updated;
  };

  const updateAddress = async (addressData) => {
    const updated = await userApi.updateAddress(addressData);
    if (updated) saveUser(updated);
    return updated;
  };

  const deleteAddress = async (addressId) => {
    const updated = await userApi.deleteAddress(addressId);
    if (updated) saveUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
