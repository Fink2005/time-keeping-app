//
export type LocationReq = {
  name: string;
  lat: string;
  lng: string;
  address: string;
  radius: number;
};

export type LocationRes = {
  data: (LocationReq & {
    id: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  })[];
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type LocationDetailRes = LocationReq & {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: string;
  deletedAt: string;
};

export type LocationUpdateDetailReq = {
  id: number;
  name: string;
  radius: number;
};
