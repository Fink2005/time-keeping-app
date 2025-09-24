/* eslint-disable @typescript-eslint/no-unused-vars */
import { http } from '@/services/apiRequest';

const authRequest = {
  async register() {
    http.post('/auth/register');
  },
};
