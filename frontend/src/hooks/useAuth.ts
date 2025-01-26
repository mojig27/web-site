// frontend/src/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api/auth.service';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { LoginCredentials, RegisterCredentials } from '@/types/api';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => 
      authService.login(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials(data.data!));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterCredentials) => 
      authService.register(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data.data!));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      dispatch(logout());
      queryClient.clear();
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: !!localStorage.getItem('token'),
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    profile: profileQuery.data?.data,
    isLoading: 
      loginMutation.isPending || 
      registerMutation.isPending || 
      profileQuery.isPending,
    error: 
      loginMutation.error || 
      registerMutation.error || 
      profileQuery.error,
  };
};