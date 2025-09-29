import AuthForm from '@/components/AuthForm';
import { icons } from '@/constants/icons';
import { LoginFormData, loginSchema } from '@/schema/auth';
import authRequest from '@/services/request/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { showAlert } from '@/utils/global';
import log from '@/utils/logger';
import { mmkvStorage } from '@/utils/mmkvStorage';
import { secureStorage } from '@/utils/secureStorage';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { setToken, setUserInfo } = useAuthStore();

  const onSubmitLoginOrRegister = async (
    data: LoginFormData,
    setLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    try {
      const accountCenterRes = await authRequest.loginByAccountCenter({
        ...data,
        key: 'YFtUnSRwEc4Dy6pjBVr8',
      });

      if (accountCenterRes) {
        const name = (await mmkvStorage.getItem('name')) || '';
        const res = await authRequest.login({
          token: accountCenterRes.data.accessToken,
          name: accountCenterRes.data.accessToken,
          ...(name && { name }),
        });
        if (!res) {
          showAlert('Error', 'Login failed, please try again.');
          return;
        }
        log(res.user);
        setToken(res?.tokens.accessToken || '');
        setUserInfo(res.user);
        await secureStorage.setItem('accessToken', res?.tokens.accessToken || '');
        showAlert('Success', 'Login successful!');
        router.replace('/(tabs)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="justify-center flex-1 gap-10 p-8 bg-white">
      <View>
        <Text className="text-4xl font-semibold">Hello.</Text>
        <Text className="text-xl font-medium text-gray-500">Welcome</Text>
      </View>
      <AuthForm
        control={control}
        type="login"
        errors={errors}
        onSubmit={(setLoading) =>
          handleSubmit((data) => onSubmitLoginOrRegister(data, setLoading))()
        }
      />

      <View className="items-center gap-4">
        <Text className="text-center text-gray-500">Or login with</Text>
        <Image source={icons.google} />
      </View>
      <Text className="text-center">
        Don&apos;t have an account?{' '}
        <Link href="/(screens)/(authScreen)/RegisterScreen" className="font-semibold text-blue-500">
          Register
        </Link>
      </Text>
    </View>
  );
};

export default LoginScreen;
