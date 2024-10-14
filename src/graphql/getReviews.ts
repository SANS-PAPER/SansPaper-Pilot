import { useEffect, useState } from 'react';
import {initializeGraphQLClient} from '@/app/api/client';
import { GetReviewsDocument } from '@/gql/_generated';
import { GraphQLClient } from 'graphql-request';
import { Review } from '@/app/profile/types/getReviews';

const useReviewData = (userId:string) => {
  const [dataReview, setReviewData] = useState<Review[]>([]);
  const [errorReview, setError] = useState<Error | null>(null);
  const [isLoadingReview, setIsLoading] = useState(true);

  const [client, setClient] = useState<GraphQLClient | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize GraphQL client if not already initialized
        if (!client) {
          const initializedClient = await initializeGraphQLClient();
          setClient(initializedClient);
        }

        if(client){
            console.log('client >>>>>>>>>>',client);
          const response = await fetchReviewData(client, userId);
          setReviewData(response);
        }


    
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
  }, [client]);

  return { dataReview, errorReview, isLoadingReview };
};

const fetchReviewData = async (client: any, userId: string) => {

  try{

    const response = await client.request(GetReviewsDocument,{userId});
     console.log('REVIEWSSSSS))))))))))))))))))) >>>>>>> >>> ',response?.reviews?.nodes)

    return response?.reviews?.nodes;


  }
  catch(error){
    // console.log('error fetching review data >>>>>>>>>',error);
    throw error;
  }

};

export default useReviewData;