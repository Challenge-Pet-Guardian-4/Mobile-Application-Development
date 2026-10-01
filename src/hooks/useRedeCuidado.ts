import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services/users';

export function useRedeCuidado() {
  return useQuery({
    queryKey: ['users', 'me', 'rede-cuidado'],
    queryFn: () => UserService.getMyRedeCuidado(),
  });
}
