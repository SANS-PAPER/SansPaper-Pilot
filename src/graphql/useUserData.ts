import { useEffect, useState } from 'react';
import { client } from '@/app/api/client';
import { GetUserDetailsByIdDocument } from '@/gql/_generated';
import { UserProfile, UseUserDataResult } from '@/app/profile/types/userProfile';

export const useUserData = (userID: string): UseUserDataResult => {
  const [dataUser, setUserData] = useState<UserProfile[]>([]);
  const [errorUser, setError] = useState<Error | null>(null);
  const [isLoadingUser, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchUserData(userID);
        setUserData(response);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Clean up function
    return () => {
      // Any cleanup code if necessary
    };
  }, [userID]);

  return { dataUser, errorUser, isLoadingUser };
};

const fetchUserData = async (userID: string): Promise<UserProfile[]> => {
  const response = await client.request<{ users: { nodes: UserProfile[] } }>(GetUserDetailsByIdDocument, { userID });
  return response?.users?.nodes ?? [];
};

export default useUserData;