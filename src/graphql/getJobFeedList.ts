import {useEffect, useState} from 'react';
import {initializeGraphQLClient} from '@/app/api/client';
import {GetJobFeedsDocument, GetUserDetailsByIdDocument} from '@/gql/_generated';
import { GetJobFeedsResponse, JobFeed } from '@/components/Feeds/types/getJobFeedsList';

const useJobFeedsData = () => {

  const [dataJobFeeds, setJobFeeds] = useState<JobFeed[] | null>(null);
  console.log("dataJobFeeds",dataJobFeeds);
  const [errorJobFeeds, setError] = useState<Error | null>(null);
  const [isLoadingJobFeeds, setIsLoading] = useState<boolean>(true);

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
          // console.log('client profile data >>>>>>>>>>',client)
          const response = await fetchJobFeeds(client, );
          setJobFeeds(response);
        }
      } catch (error) {
        setError(errorJobFeeds);
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

  return {dataJobFeeds, errorJobFeeds, isLoadingJobFeeds};
};

const fetchJobFeeds = async (client: any): Promise<JobFeed[]> => {
    try {
      const response: GetJobFeedsResponse = await client.request(GetJobFeedsDocument);
      return response.jobFeeds.nodes;
    } catch (error) {
      throw error;
    }
  };

export default useJobFeedsData;