import AuthForm from '@/components/AuthForm';
import { icons } from '@/constants/icons';
import { LoginFormData, loginSchema } from '@/schema/auth';
import authRequest from '@/services/request/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { showAlert } from '@/utils/global';
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

  const { setToken } = useAuthStore();

  const onSubmitLoginOrRegister = async (
    data: LoginFormData,
    setLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    setLoading(true);
    try {
      const res = await authRequest.login(data);
      if (res) {
        setToken(res.accessToken);
        await secureStorage.setItem('accessToken', res.accessToken);
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
