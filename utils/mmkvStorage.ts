/* eslint-disable no-console */
// mmkvStorage.ts
import { MMKV } from 'react-native-mmkv';

// Khởi tạo storage
const storage = new MMKV();

export const mmkvStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = storage.getString(key);
      return value ?? null;
    } catch (error) {
      console.error('Error getting item from MMKV:', error);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      storage.set(key, value);
    } catch (error) {
      console.error('Error setting item in MMKV:', error);
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error('Error removing item from MMKV:', error);
    }
  },

  // optional: clear all
  clear: async (): Promise<void> => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing MMKV storage:', error);
    }
  },
};
