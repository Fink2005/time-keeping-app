export type AttendanceReq = {
  lat: string;
  lng: string;
  address: string;
  location?: {
    name: string;
  };
  radius?: number;
  locationId?: string;
  type?: 'CHECK_IN' | 'CHECK_OUT';
  imageUri?: string;
};

export type AttendanceRes = {
  data: AttendanceReq[] &
    {
      id: string;
      userId: number;
    }[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AttendanceRecord = Omit<AttendanceReq, 'location' | 'radius'>;
