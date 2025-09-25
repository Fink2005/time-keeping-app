import { http } from '@/services/apiRequest';
import { LoginReq, LoginRes, RegisterRequest, RegisterRes } from '@/types/auth';

const authRequest = {
  async register(data: RegisterRequest): Promise<RegisterRes | null> {
    const res = await http.post<RegisterRes | null>('/auth/register', data);
    return res;
  },
  async login(data: LoginReq): Promise<LoginRes | null> {
    const res = await http.post<LoginRes | null>('/auth/login', data);
    return res;
  },
};

export default authRequest;
