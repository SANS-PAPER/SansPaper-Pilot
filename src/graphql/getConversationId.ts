import {useEffect, useState} from 'react';
import {initializeGraphQLClient} from '@/app/api/client';
import {GetConversationIdDocument} from '@/gql/_generated';
import { GraphQLClient } from 'graphql-request';
import { ConversationUserNode, GetConversationIdResponse } from '@/components/Chat/types/getConversationId';

const useConversationData = (userIds: string)=> {
  //const [dataConversation, setUserData] = useState<ConversationUserNode[] | null>(null);
  const [dataConversation, setUserData] = useState<ConversationUserNode[]>([]);
  const [errorConversation, setError] = useState(null);
  const [isLoadingConversation, setIsLoading] = useState(true);

  const [client, setClient] = useState<GraphQLClient | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize GraphQL client if not already initialized
        if (!client) {
          const initializedClient = await initializeGraphQLClient();
          setClient(initializedClient);
        }

        if (client) {
          const response = await fetchUserData(client, userIds);
          setUserData(response);
        }
      } catch (error) {
        setError(errorConversation);
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

  return {dataConversation, errorConversation, isLoadingConversation};
};

const fetchUserData = async (client: any, userIds: string) => {
  try {
    const response = await client.request(GetConversationIdDocument, { userIds });
    console.log("GraphQL Response:", response); // Log the full response
    return response?.conversations?.nodes; // Return null if no nodes
  } catch (error) {
    throw error;
  }
};

export default useConversationData;