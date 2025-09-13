/* eslint-disable react-native/no-color-literals */
import CheckInOutOptions from '@/components/home/CheckInOutOptions';
import { getData } from '@/utils/asyncStorage';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Switch, Text, TouchableHighlight, View } from 'react-native';
type Props = {
  latitude: number;
  longitude: number;
  address: string | null;
  setReMount: React.Dispatch<React.SetStateAction<number>>;
};
const AttendanceBottomSheet = ({ setReMount, latitude, longitude, address }: Props) => {
  const isFocused = useIsFocused();
  const [isEnabled, setIsEnabled] = useState(false);
  const [attendanceType, setAttendanceType] = useState<'check-in' | 'check-out'>('check-in');

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);
  useEffect(() => {
    if (!isFocused) {
      bottomSheetRef.current?.dismiss();
    }
  }, [isFocused]);
  useEffect(() => {
    getData('attendanceType').then((data) => {
      setAttendanceType(data || 'check-in');
    });
  }, []);

  return (
    <View className="flex-row items-center justify-between p-4 mt-4 border border-gray-300 rounded-xl">
      <Switch onValueChange={() => setIsEnabled((prev) => !prev)} value={isEnabled} />

      <TouchableHighlight
        className="bg-[#363C44] rounded-lg flex-1 ms-4"
        underlayColor="#4b5563"
        onPress={() => bottomSheetRef.current?.present()}
      >
        <Text className="p-3 font-semibold text-center text-white">
          {attendanceType === 'check-in' ? 'Chấm công vào' : 'Chấm công ra'}
        </Text>
      </TouchableHighlight>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        style={{
          borderColor: 'gray',
          borderWidth: 0.3,
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <BottomSheetView className="p-4 bg-white pb-14 ">
          <Text className="text-lg font-semibold text-left ms-2">Chọn cách chấm công</Text>
          <CheckInOutOptions
            type={attendanceType}
            iconName="camera"
            title="Chụp ảnh chấm công"
            description="Chấm công kèm theo xác thực bằng ảnh"
          />
          <CheckInOutOptions
            type={attendanceType}
            iconName="flash"
            title="Chấm công nhanh"
            description="Chấm công nhanh không cần ảnh"
            locationData={{ latitude, longitude, address }}
            setReMount={setReMount}
            setAttendanceType={setAttendanceType}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default AttendanceBottomSheet;
