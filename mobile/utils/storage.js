import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'lifelink_auth_token';
const USER_KEY = 'lifelink_user_data';

// Fallback for web or if secure store fails
let memoryStore = {};

const isWeb = Platform.OS === 'web';

export const setToken = async (token) => {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    memoryStore[TOKEN_KEY] = token;
  }
};

export const getToken = async () => {
  if (isWeb) return localStorage.getItem(TOKEN_KEY);
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    return memoryStore[TOKEN_KEY] || null;
  }
};

export const removeToken = async () => {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    delete memoryStore[TOKEN_KEY];
  }
};

export const setUser = async (user) => {
  const userStr = JSON.stringify(user);
  if (isWeb) {
    localStorage.setItem(USER_KEY, userStr);
    return;
  }
  try {
    await SecureStore.setItemAsync(USER_KEY, userStr);
  } catch (error) {
    memoryStore[USER_KEY] = userStr;
  }
};

export const getUser = async () => {
  if (isWeb) {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  }
  try {
    const data = await SecureStore.getItemAsync(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return memoryStore[USER_KEY] ? JSON.parse(memoryStore[USER_KEY]) : null;
  }
};

export const removeUser = async () => {
  if (isWeb) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    delete memoryStore[USER_KEY];
  }
};

export const clearAll = async () => {
  await removeToken();
  await removeUser();
};
