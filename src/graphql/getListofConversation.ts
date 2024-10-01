import {useEffect, useState} from 'react';
import {initializeGraphQLClient} from '@/app/api/client';
import {GetListOfConversationDocument} from '@/gql/_generated';
import { GraphQLClient } from 'graphql-request';
import { ConversationUserNode, GetListOfConversationResponse } from '@/components/Chat/types/getListofConversation';

const useGetConversationList = (userId:string) => {
  const [dataChatList, setChatList] = useState<ConversationUserNode[] | null>(null);
  const [errorChatList, setError] = useState(null);
  const [isLoadingChatList, setIsLoading] = useState(true);

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
          const response = await fetchChatList(client,userId);
          setChatList(response);
        }
      } catch (error) {
        setError(errorChatList);
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

  return {dataChatList, errorChatList, isLoadingChatList, fetchChatList};
};

export const fetchChatList = async (client: any,userId: string) => {
  console.log('userId', userId);
  try {
    const response: GetListOfConversationResponse = await client.request(GetListOfConversationDocument, {
      userId,
    });

    console.log('response chat list  >>>>>>>>>', response);

    return response?.conversationUsers?.nodes;
  } catch (error) {
    console.log('error chat list  >>>>>>>>>', error);
    throw error;
  }
};

export default useGetConversationList;