import userRequest from '@/services/request/user';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';

export const useGetMe = () => {
  return useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await userRequest.getMe();
      if (!response) {
        throw new Error('Failed to fetch user data');
      }
      return response;
    },
  });
};
