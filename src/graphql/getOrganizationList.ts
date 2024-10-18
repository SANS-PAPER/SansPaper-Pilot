"use client";

import { useEffect, useState } from 'react';
import { client } from '@/app/api/client';
import { GetAllOrganizationDocument } from '@/gql/_generated';
import { GetOrganizationListResponse, OrganizationNode } from '@/components/Organization/types/getOrganizationList';

const useGetOrganizationList = (value: boolean) => {
  const [dataOrganizationList, setOrganizationList] = useState<OrganizationNode[] | null>(null);
  const [errorOrganizationList, setError] = useState<Error | null>(null);
  const [isLoadingOrganizationList, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize the GraphQL client
        const response = await fetchOrganizationList(value);
        setOrganizationList(response);
      } catch (error) {
        setError(errorOrganizationList);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Clean up function
    return () => {
      // Any cleanup code if necessary
    };
  }, [value]);

  return { dataOrganizationList, errorOrganizationList, isLoadingOrganizationList };
};

const fetchOrganizationList = async (all: any): Promise<OrganizationNode[]> => {
  try {
    const response: GetOrganizationListResponse = await client.request(GetAllOrganizationDocument, { all });

    return response?.organizations?.nodes || []; // Return an empty array if nodes are undefined
  } catch (error) {
    console.log('Error fetching organization list:', error);
    throw error;
  }
};

export default useGetOrganizationList;