import { http } from '@/services/apiRequest';
import { User } from '@/types/user';

const userRequest = {
  getMe: (): Promise<User | null> => {
    return http.get<User | null>({
      endpoint: '/user/profile',
    });
  },
};

export default userRequest;
