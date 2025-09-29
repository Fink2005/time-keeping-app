export type User = {
  id: number;
  email: string;
  keycloakId: string;
  name: string;
  phoneNumber: string | null;
  avatar: string;
  status: 'ACTIVE' | 'INACTIVE';
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
