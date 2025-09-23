/* eslint-disable react-native/no-color-literals */
import { AttendanceBase } from '@/types/Attendance';
import { getData } from '@/utils/asyncStorage';
import { dateFormatted } from '@/utils/global';
import log from '@/utils/logger';
import React, { useEffect, useState } from 'react';
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

type MarkedDate = {
  selected: boolean;
  marked: boolean;
  dots: { key: string; color: string }[];
};

const CalendarCustom = () => {
  const [markedDays, setMarkedDays] = useState<Record<string, MarkedDate>>({});

  useEffect(() => {
    const fetchAttendance = async () => {
      const data: AttendanceBase[] = await getData('attendanceRecords');

      const formattedData = data.reduce<Record<string, MarkedDate>>((acc, record) => {
        const formattedDate = dateFormatted(record.createdAt);

        if (!acc[formattedDate]) {
          acc[formattedDate] = {
            selected: true,
            marked: true,
            dots: [],
          };
        }

        // let color;

        // if (record.type === 'check-out') {
        //   color = 'orange';
        // } else {
        //   color = 'green';
        // }

        // acc[formattedDate].dots.push({
        //   key: `${record.type}-${record.id}`,
        //   color,
        // });

        return acc;
      }, {});

      log(formattedData);
      setMarkedDays(formattedData);
    };

    fetchAttendance();
  }, []);

  return (
    <Calendar
      style={{
        borderRadius: 15,
        borderColor: 'gray',
        borderWidth: 0.3,
        padding: 10,
      }}
      hideExtraDays
      firstDay={1}
      markingType="custom"
      markedDates={{
        ...markedDays,
      }}
    />
  );
};

export default CalendarCustom;
