/* eslint-disable react-native/no-color-literals */
import { AttendanceDetailRes } from '@/types/attendance';
import React, { useState } from 'react';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// =========================
// Locale Configuration (Vietnamese)
// =========================
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ],
  monthNamesShort: [
    'Th1',
    'Th2',
    'Th3',
    'Th4',
    'Th5',
    'Th6',
    'Th7',
    'Th8',
    'Th9',
    'Th10',
    'Th11',
    'Th12',
  ],
  dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

const CalendarCustom = ({
  onRefetch,
  initialDate,
  markedDates,
}: {
  onRefetch: (date: string) => void;
  initialDate: string;
  markedDates: AttendanceDetailRes['dataCalendarAttendace'];
}) => {
  const [selectedDay, setSelectedDay] = useState<string>(initialDate);
  const handleSelectedDay = (day: string) => {
    setSelectedDay(day);
    onRefetch(day);
  };
  return (
    <Calendar
      style={{
        borderRadius: 15,
        borderColor: 'gray',
        borderWidth: 0.3,
        padding: 10,
      }}
      initialDate={initialDate}
      hideExtraDays
      onDayPress={(day) => {
        handleSelectedDay(day.dateString);
      }}
      firstDay={1}
      markingType="custom"
      markedDates={{
        ...markedDates,
        [selectedDay]: {
          selected: true,
          activeOpacity: 1,
          selectedColor: '#286BD7',
        },
      }}
    />
  );
};

export default CalendarCustom;
