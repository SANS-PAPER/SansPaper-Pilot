import { useEffect, useState } from 'react';
import { initializeGraphQLClient } from '@/app/api/client';
import { GetCompletedFormTrainingDocument } from '@/gql/_generated';
import { FormNode } from '@/app/profile/types/getCompletedTrainingForm';
import { GraphQLClient } from 'graphql-request';

const useCompletedForm = (userId: string) => {
  const [dataCompleted, setDataCompleted] = useState<FormNode[]>([]);
  const [errorCompleted, setError] = useState<Error | null>(null);
  const [isLoadingCompleted, setIsLoading] = useState(true);

  const [client, setClient] = useState<GraphQLClient | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!client) {
          const initializedClient = await initializeGraphQLClient();
          setClient(initializedClient);
        }

        if (client) {
          console.log('Client exists, fetching data for userId >>>>>>>>>', userId);
          const response = await fetchCompletedForm(client, userId);
          setDataCompleted(response);
        }
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [client, userId]);

  return { dataCompleted, errorCompleted, isLoadingCompleted };
};

const fetchCompletedForm = async (
  client: GraphQLClient,
  userId: string
): Promise<FormNode[]> => {
  console.log('Fetching data inside function');
  try {
    const response: { fillupForms?: { nodes?: FormNode[] } } = await client.request(GetCompletedFormTrainingDocument, {
      userID: userId, // Ensure the variable name matches what the query expects
    });

    return response?.fillupForms?.nodes || [];
  } catch (error) {
    console.log('Error fetching completed forms >>>>>>>>>', error);
    throw error;
  }
};

export default useCompletedForm;
