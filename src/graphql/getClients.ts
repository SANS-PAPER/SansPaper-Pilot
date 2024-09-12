import { useState, useEffect } from 'react';
import { initializeGraphQLClient } from '@/app/api/client';
import { useUpdateSummaryMutation } from '@/gql/_generated';

const useGetClient = () => {

  const [errorClient, setError] = useState(null);
  const [isLoadingClient, setIsLoading] = useState(true);

  const [client, setClient] = useState<any>(null); // State to hold the GraphQL client

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!client) {
          const initializedClient = await initializeGraphQLClient();
          setClient(initializedClient);
        }

    
      } catch (error) {
        setError(errorClient);
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

  return { client, errorClient, isLoadingClient};
 
};

export default useGetClient;