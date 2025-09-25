export type LocationReq = {
  name: string;
  lat: string;
  lng: string;
  address: string;
  radius: number;
};

export type LocationDetailRes = LocationReq & {
  userId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};
