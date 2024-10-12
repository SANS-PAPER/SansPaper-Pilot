import { useEffect, useRef, useState } from 'react';
import { initializeGraphQLClient } from '@/app/api/client';
import { GetConversationIdDocument } from '@/gql/_generated';
import { GraphQLClient } from 'graphql-request';
import { ConversationUserNode, GetConversationIdResponse } from '@/components/Chat/types/getConversationId';

const useConversationData = (userIds: string[]) => {
  const [dataConversation, setDataConversation] = useState<ConversationUserNode[]>([]);
  const [errorConversation, setErrorConversation] = useState<any>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);

  const prevUserIds = useRef<string[]>([]);

useEffect(() => {
  if (JSON.stringify(prevUserIds.current) === JSON.stringify(userIds)) {
    // Skip fetching if the userIds are the same as the previous ones
    return;
  }

  prevUserIds.current = userIds;

  const fetchData = async () => {
    try {
      const client = await initializeGraphQLClient();
      const response = await fetchUserData(client, userIds);
      setDataConversation(response);
    } catch (error) {
      setErrorConversation(error);
    } finally {
      setIsLoadingConversation(false);
    }
  };
  
  fetchData();
}, [userIds]);
// Dependency on userIds to refetch if userIds change

  return { dataConversation, errorConversation, isLoadingConversation };
};

const fetchUserData = async (client: GraphQLClient, userIds: string[]) => {
  try {
    const response: GetConversationIdResponse = await client.request(GetConversationIdDocument, { userIds});
    return response?.conversations?.nodes || [];
  } catch (error) {
    throw new Error('Error fetching conversation data');
  }
};

export default useConversationData;
