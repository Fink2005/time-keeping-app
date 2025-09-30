import * as Clipboard from 'expo-clipboard';
import { Alert, Platform, ToastAndroid } from 'react-native';

export const showAlert = (title: string, message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert(title, message);
  }
};

export const copy = async (data: string) => {
  if (data) {
    await Clipboard.setStringAsync(data);
    showAlert('Success', 'Lưu thành công!');
  }
};

export const dateFormatted = (dateStr: string, type: 'ISO' | 'SLASH') => {
  const date = new Date(dateStr);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return type === 'ISO' ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
};

export const formatDate = (dateStr: string, type: 'weekly' | 'daily') => {
  const date = new Date(dateStr);

  // Lấy tên thứ
  const weekday = date.toLocaleDateString('vi-VN', { weekday: 'long' });

  // Lấy giờ và phút
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Xác định sáng/tối
  const period = hours >= 12 ? 'tối' : 'sáng';

  // Đưa về dạng 12h nếu bạn muốn: 13h -> 1h
  // Nếu bạn muốn giữ nguyên 22:00 thì bỏ đoạn này
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  return type === 'weekly' ? weekday : `${hours}:${minutes} ${period}`;
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const formatName = (name: string) => {
  const nameSplit = name.split(' ');
  return nameSplit[nameSplit.length - 1];
};
