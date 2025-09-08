import * as Clipboard from 'expo-clipboard';
import { Alert, Platform, ToastAndroid } from 'react-native';

export const showCopyFeedback = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('Success', message);
  }
};

export const copy = async (data: string) => {
  if (data) {
    await Clipboard.setStringAsync(data);
    showCopyFeedback('Address copied!');
  }
};
