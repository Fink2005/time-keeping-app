import { LoginFormData, RegisterFormData } from '@/schema/auth';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Control, Controller, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props =
  | {
      type: 'login';
      control: Control<LoginFormData>;
      handleSubmit: UseFormHandleSubmit<LoginFormData>;
      errors: FieldErrors<LoginFormData>;
      onSubmit: (data: LoginFormData) => void;
    }
  | {
      type: 'register';
      control: Control<RegisterFormData>;
      handleSubmit: UseFormHandleSubmit<RegisterFormData>;
      errors: FieldErrors<RegisterFormData>;
      onSubmit: (data: RegisterFormData) => void;
    };

const AuthForm = ({ type, control, handleSubmit, errors, onSubmit }: Props) => {
  const [password, setPassword] = useState({
    isDisplayPassword: false,
    isDisplayConfirmPassword: false,
  });
  return (
    <View>
      {/* Name Field */}
      {type === 'register' && (
        <Controller
          control={control} // No assertion needed; TypeScript infers Control<RegisterFormData>
          name="name"
          render={({ field: { onChange, value } }) => (
            <View className="gap-2 mb-4">
              <Text>Name</Text>
              <View className="relative">
                <Feather
                  name="user"
                  size={18}
                  color="#aaa"
                  className="absolute -translate-y-1/2 top-1/2 left-3"
                />
                <TextInput
                  className={`border p-3 ps-10 rounded-md ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter name"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="default"
                  autoCapitalize="words"
                  accessibilityLabel="Name input"
                />
              </View>
              {errors.name && (
                <Text className="mt-1 text-sm text-red-500">{errors.name.message}</Text>
              )}
            </View>
          )}
        />
      )}

      {/* Email Field */}
      <Controller
        control={control as Control<LoginFormData | RegisterFormData>} // Type assertion to satisfy both types
        name="email"
        render={({ field: { onChange, value } }) => (
          <View className="gap-2 mb-4">
            <Text>Email</Text>
            <View className="relative">
              <Feather
                name="mail"
                size={18}
                color="#aaa"
                className="absolute -translate-y-1/2 top-1/2 left-3"
              />
              <TextInput
                className={`border p-3 ps-10 rounded-md ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email input"
              />
            </View>
            {errors.email && (
              <Text className="mt-1 text-sm text-red-500">{errors.email.message}</Text>
            )}
          </View>
        )}
      />

      {/* Password Field */}
      <Controller
        control={control as Control<LoginFormData | RegisterFormData>} // Type assertion to satisfy both types
        name="password"
        render={({ field: { onChange, value } }) => (
          <View className="gap-2 mb-4">
            <Text>Password</Text>
            <View className="relative">
              <Feather
                name="lock"
                size={18}
                color="#aaa"
                className="absolute -translate-y-1/2 top-1/2 left-3"
              />
              <Pressable
                className="absolute z-50 -translate-y-1/2 top-1/2 right-3"
                onPress={() =>
                  setPassword((prev) => ({ ...prev, isDisplayPassword: !prev.isDisplayPassword }))
                }
              >
                {!password.isDisplayPassword ? (
                  <Feather name="eye-off" size={18} color="black" />
                ) : (
                  <Feather name="eye" size={18} color="black" />
                )}
              </Pressable>

              <TextInput
                className={`border p-3 ps-10 rounded-md ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
                value={value}
                onChangeText={onChange}
                secureTextEntry={!password.isDisplayPassword}
                accessibilityLabel="Password input"
              />
            </View>
            {errors.password && (
              <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>
            )}
          </View>
        )}
      />

      {/* Confirm Password Field */}
      {type === 'register' && (
        <Controller
          control={control} // No assertion needed; TypeScript infers Control<RegisterFormData>
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <View className="gap-2 mb-4">
              <Text>Confirm Password</Text>
              <View className="relative">
                <Feather
                  name="lock"
                  size={18}
                  color="#aaa"
                  className="absolute -translate-y-1/2 top-1/2 left-3"
                />
                <Pressable
                  className="absolute z-50 -translate-y-1/2 top-1/2 right-3"
                  onPress={() =>
                    setPassword((prev) => ({
                      ...prev,
                      isDisplayConfirmPassword: !prev.isDisplayConfirmPassword,
                    }))
                  }
                >
                  {!password.isDisplayConfirmPassword ? (
                    <Feather name="eye-off" size={18} color="black" />
                  ) : (
                    <Feather name="eye" size={18} color="black" />
                  )}
                </Pressable>

                <TextInput
                  className={`border p-3 ps-10 rounded-md ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter confirm Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!password.isDisplayConfirmPassword}
                  accessibilityLabel="Password input"
                />
              </View>
              {errors.confirmPassword && (
                <Text className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</Text>
              )}
            </View>
          )}
        />
      )}

      {/* Submit Button */}
      {type === 'login' ? (
        <TouchableOpacity className="p-3 bg-blue-500 rounded-md" onPress={handleSubmit(onSubmit)}>
          <Text className="font-semibold text-center text-white">Đăng nhập</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity className="p-3 bg-blue-500 rounded-md" onPress={handleSubmit(onSubmit)}>
          <Text className="font-semibold text-center text-white">Đăng ký</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AuthForm;
