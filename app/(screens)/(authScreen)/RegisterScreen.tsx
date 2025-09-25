import AuthForm from '@/components/AuthForm';
import { images } from '@/constants/images';
import { RegisterFormData, registerSchema } from '@/schema/auth';
import authRequest from '@/services/request/auth';
import { showAlert } from '@/utils/global';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Text, View } from 'react-native';

const RegisterScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmitLoginOrRegister = async (
    data: RegisterFormData,
    setIsLoading: Dispatch<SetStateAction<boolean>>,
  ) => {
    try {
      setIsLoading(true);
      await authRequest.register(data);
      showAlert('Success', 'Đăng kí thành công! , vui lòng xác nhận qua email.');
      router.push('/(screens)/(authScreen)/LoginScreen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="justify-center flex-1 gap-10 p-8 -translate-y-10 bg-white">
      <View className="items-center">
        <Image source={images.logo} className="h-24 w-44" />
        <View className="items-center gap-1 -translate-y-4">
          <Text className="text-3xl font-bold">Nice to see you!</Text>
          <Text className="text-sm font-medium text-gray-500">Create your account</Text>
        </View>
      </View>
      <AuthForm
        control={control}
        type="register"
        errors={errors}
        onSubmit={(setIsLoading: Dispatch<SetStateAction<boolean>>) => {
          handleSubmit((data) => onSubmitLoginOrRegister(data, setIsLoading))();
        }}
      />
    </View>
  );
};

export default RegisterScreen;
