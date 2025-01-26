// frontend/src/components/auth/LoginForm.tsx
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@/schemas/auth';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

export const LoginForm: FC = () => {
  const { login, isLoading } = useAuth();
  const { 
    register, 
    handleSubmit,
    formState: { errors } 
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data);
    } catch (error) {
      console.error('خطا در ورود:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="ایمیل"
        {...register('email')}
        error={errors.email?.message}
        required
      />
      <Input
        label="رمز عبور"
        type="password"
        {...register('password')}
        error={errors.password?.message}
        required
      />
      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
      >
        ورود
      </Button>
    </form>
  );
};