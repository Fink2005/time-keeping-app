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
