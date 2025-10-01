import { LoginFormData, RegisterFormData } from '@/schema/auth';
import { Feather } from '@expo/vector-icons';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  type: 'login' | 'register';
  control: Control<LoginFormData> | Control<RegisterFormData>;
  onSubmit: (setIsLoading: Dispatch<SetStateAction<boolean>>) => void;
  errors: FieldErrors<LoginFormData> | FieldErrors<RegisterFormData>;
};

const AuthForm = ({ type, control, onSubmit, errors }: Props) => {
  const [password, setPassword] = useState({
    isDisplayPassword: false,
    isDisplayConfirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const registerErrors = errors as FieldErrors<RegisterFormData>;
  const commonControl = control as Control<LoginFormData | RegisterFormData>;
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Name Field */}
      {type === 'register' && (
        <Controller
          control={control as Control<RegisterFormData>}
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
                    registerErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter name"
                  value={value}
                  placeholderTextColor="#54585f"
                  onChangeText={onChange}
                  keyboardType="default"
                  autoCapitalize="words"
                  accessibilityLabel="Name input"
                />
              </View>
              {registerErrors.name && (
                <Text className="mt-1 text-sm text-red-500">{registerErrors.name.message}</Text>
              )}
            </View>
          )}
        />
      )}

      {/* Email Field */}
      <Controller
        control={commonControl}
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
                placeholderTextColor="#54585f"
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
        control={commonControl} // Type assertion to satisfy both types
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
                placeholderTextColor="#54585f"
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
          control={control as Control<RegisterFormData>}
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
                    registerErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholderTextColor="#54585f"
                  placeholder="Enter confirm Password"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={!password.isDisplayConfirmPassword}
                  accessibilityLabel="Password input"
                />
              </View>
              <Text className="mt-1 text-sm text-red-500">
                {registerErrors.confirmPassword?.message}
              </Text>
            </View>
          )}
        />
      )}
      {/* Submit Button */}
      <Pressable className="p-3 bg-blue-500 rounded-md" onPress={() => onSubmit(setIsLoading)}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-semibold text-center text-white">
            {type === 'login' ? 'Login' : 'Register'}
          </Text>
        )}
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default AuthForm;
