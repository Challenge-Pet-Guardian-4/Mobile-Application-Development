import { useQuery } from '@tanstack/react-query';
import { UserService } from '../services/users';
import { queryKeys } from '../lib/queryKeys';

export function useRedeCuidado() {
  return useQuery({
    queryKey: queryKeys.users.redeCuidado,
    queryFn: () => UserService.getMyRedeCuidado(),
  });
}
