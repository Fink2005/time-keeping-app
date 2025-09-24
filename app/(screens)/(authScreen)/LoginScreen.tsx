/* eslint-disable no-console */
import AuthForm from '@/components/AuthForm';
import { icons } from '@/constants/icons';
import { LoginFormData, loginSchema } from '@/schema/auth';
import { useUserStore } from '@/store/useAuthStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
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

  const { setToken, setUserId } = useUserStore();

  const onSubmit = (data: LoginFormData) => {
    setToken(data.email); // Example: Use email as token
    setUserId('user123'); // Example: Set a user ID
    console.log('Login submitted:', data);
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
        handleSubmit={handleSubmit}
        errors={errors}
        onSubmit={onSubmit}
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
