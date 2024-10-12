//import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  IS_FIRST_TIME: 'is_first_time',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
};

export const storeData = async (key: string, value: string) => {
  try {
    await localStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (key: string) => {
  try {
    const value = await localStorage.getItem(key);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const removeData = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};

export const clearData = () => {
  try {
    localStorage.clear();
  } catch (e) {
    console.log(e);
  }
};