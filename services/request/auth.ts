import { http } from '@/services/apiRequest';
import {
  LoginAccountCenterReq,
  LoginAccountCenterRes,
  LoginReq,
  LoginRes,
  RegisterAccountCenterReq,
  RegisterRes,
} from '@/types/Auth';

const authRequest = {
  async register(data: RegisterAccountCenterReq): Promise<RegisterRes | null> {
    const res = await http.post<RegisterRes | null>({
      endpoint: '/auth/register',
      data,
      isAccountCenterApi: true,
    });
    return res;
  },
  async login(data: LoginReq): Promise<LoginRes | null> {
    return await http.post<LoginRes | null>({
      endpoint: '/user/auth',
      data,
    });
  },
  async loginByAccountCenter(data: LoginAccountCenterReq): Promise<LoginAccountCenterRes | null> {
    const res = await http.post<LoginAccountCenterRes | null>({
      endpoint: '/auth/login',
      data,
      isAccountCenterApi: true,
    });
    return res;
  },
};

export default authRequest;
