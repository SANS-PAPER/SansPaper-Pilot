"use client";

import {useEffect, useState} from 'react';
import {initializeGraphQLClient} from '@/app/api/client';
import {GetUserListDocument} from '@/gql/_generated';
import { GetUserListResponse, UserNode } from '@/components/Jobs/types/getUserList';

const useGetUserList = () => {
    const [dataUserList, setUserList] = useState<UserNode[] | null>(null);
    const [errorUserList, setError] = useState<Error | null>(null);
    const [isLoadingUserList, setIsLoading] = useState<boolean>(true);
    const [client, setClient] = useState<any>(null); // State to hold the GraphQL client

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize GraphQL client if not already initialized
        if (!client) {
          const initializedClient = await initializeGraphQLClient();
          setClient(initializedClient);
        }

        if (client) {
          const response = await fetchUserList(client);
          setUserList(response);
        }
      } catch (error) {
        setError(errorUserList);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Clean up function
    return () => {
      // Any cleanup code if necessary
    };
  }, [client]);

  return {dataUserList, errorUserList, isLoadingUserList};
};

const fetchUserList = async (client: any): Promise<UserNode[]> => {
    try {
      const response: GetUserListResponse = await client.request(GetUserListDocument);
  
      return response?.users?.nodes || []; // Return an empty array if nodes are undefined
    } catch (error) {
      console.log('Error fetching user list:', error);
      throw error;
    }
  };

export default useGetUserList;