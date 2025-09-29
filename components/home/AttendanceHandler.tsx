/* eslint-disable react-native/no-color-literals */
import CheckInOutOptions from '@/components/home/CheckInOutOptions';
import { AttendanceType } from '@/enum/Attendance';
import { useCommonStore } from '@/store/useCommonStore';

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TextInput, TouchableHighlight, View } from 'react-native';
import Switch from 'react-native-switch-toggles';
type Props = {
  latitude: number;
  longitude: number;
  address: string | null;
};
const AttendanceHandler = ({ latitude, longitude, address }: Props) => {
  const isFocused = useIsFocused();
  const [isEnabled, setIsEnabled] = useState(false);

  const [noteValue, setNoteValue] = useState('');

  const attendanceType = useCommonStore((state) => state.attendanceType);
  const setAttendanceType = useCommonStore((state) => state.setAttendanceType);

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);
  useEffect(() => {
    if (!isFocused) {
      bottomSheetRef.current?.dismiss();
    }
  }, [isFocused]);

  return (
    <View className="gap-3 p-4 mt-4 border border-gray-300 rounded-xl">
      <TextInput
        className="p-3 border border-gray-300 rounded-lg"
        placeholder="Thêm ghi chú"
        onChangeText={setNoteValue}
        value={noteValue}
      />
      <View className="flex-row items-center justify-between ">
        <Switch
          size={40}
          value={isEnabled}
          onChange={(value) => setIsEnabled(value)}
          activeTrackColor="#22c55e"
          renderActiveThumbIcon={() => <Text className="text-xs font-medium">on</Text>}
          renderInactiveThumbIcon={() => <Text className="text-xs font-medium">off</Text>}
          renderOnIndicator={() => <Text style={{ fontSize: 12, color: 'white' }}>auto</Text>}
          renderOffIndicator={() => <Text style={{ fontSize: 12, color: 'white' }}>auto</Text>}
        />

        <TouchableHighlight
          className={`${attendanceType === AttendanceType.CHECK_IN ? 'bg-blue-500' : 'bg-orange-500'} flex-1  rounded-lg ms-4`}
          underlayColor="#4b5563"
          onPress={() => bottomSheetRef.current?.present()}
        >
          <Text className="p-3 font-semibold text-center text-white">
            {attendanceType === AttendanceType.CHECK_IN ? 'Chấm công vào' : 'Chấm công ra'}
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
              noteValue={noteValue}
              type={attendanceType}
              iconName="camera"
              title="Chụp ảnh chấm công"
              description="Chấm công kèm theo xác thực bằng ảnh"
            />
            <CheckInOutOptions
              noteValue={noteValue}
              type={attendanceType}
              iconName="flash"
              title="Chấm công nhanh"
              description="Chấm công nhanh không cần ảnh"
              locationData={{ latitude, longitude, address }}
              setAttendanceType={setAttendanceType}
            />
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </View>
  );
};

export default memo(AttendanceHandler);
