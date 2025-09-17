import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
    const json = await AsyncStorage.getItem('user');
    if (json) {
      const savedUser = JSON.parse(json);
      setUser(savedUser);          // update context
      console.log('User loaded:', savedUser);
    } else {
      console.log('No user found in storage');
    }
  } catch (err) {
    console.log('Error loading user:', err);
  }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('https://ab-delta-six.vercel.app/api/auth/signin', { email, password });
      setUser(res.data);
      await AsyncStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('https://ab-delta-six.vercel.app/api/auth/signup', { username, email, password });
      setUser(res.data);
      await AsyncStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, setUser, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
