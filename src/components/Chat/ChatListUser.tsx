import React, { useEffect, useMemo } from 'react';
import { useUserStore } from '@/store/user/userStore';
import { List, Avatar, Typography, Spin } from 'antd';
import useGetUserList from '@/graphql/getUserList';
import { UserNode } from '../AdminSearch/types/getUserList';
import './style.css'; // Replace with your web-compatible styles

const { Text } = Typography;

const ChatListUserScreen = ({ searchQuery, setSelectedChat, setSearchQuery  }: { searchQuery: string; setSelectedChat: React.Dispatch<React.SetStateAction<any>>; setSearchQuery: React.Dispatch<React.SetStateAction<string>>; }) => {
  const { dataUserList, errorUserList, isLoadingUserList } = useGetUserList();
  const { userId, setUserId, chatList, updateChatList, addConversation } = useUserStore(); // Access chatList from Zustand

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!dataUserList) return [];
    if (!searchQuery) return dataUserList;

    return dataUserList.filter((item: UserNode) =>
      item.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dataUserList, searchQuery]);

  // Function to handle user selection
  const handleUserPress = (item: UserNode) => {
    if (item && item.id) {
      // Check if a conversation already exists with this user
      const existingChat = chatList.find((chat) => chat.receiverID === item.id);
  
      if (!existingChat) {
        // Create a new conversation only if it doesn't exist
        const newChat = {
          conversationID: `conv_${item.id}`, // Add a unique conversation ID
          receiverID: item.id,
          name: item.name,
          lastMessage: '', // Start with no last message
          time: new Date().toISOString(), // Set current time
          avatar: item.profile?.photo || '', // Use user's photo or default
          conversationUpdatedDate: new Date(), // Set the updated date
        };
  
        // Use Zustand to add the new conversation
        addConversation(newChat);
  
        // Set the selected chat to the newly created conversation
        setSelectedChat(newChat);
      } else {
        // If conversation already exists, just set it as the selected chat
        setSelectedChat(existingChat);
      }
      setSearchQuery('');
    }
  };
  
  // Get user photos or default avatar
  const getPhotos = (photo: string | null) => {
    return photo ? (
      <Avatar size={35} src={photo} />
    ) : (
      <Avatar size={35} style={{ backgroundColor: '#6733b9' }} />
    );
  };

  // Render each user item
  const renderItem = (item: UserNode) => (
    <List.Item onClick={() => handleUserPress(item)}>
      <List.Item.Meta
        avatar={getPhotos(item.profile?.photo ?? null)}
        title={<Text>{item.name}</Text>}
        description={<Text type="secondary">{item.email}</Text>}
      />
    </List.Item>
  );

  return (
    <div>
      {isLoadingUserList ? (
        <Spin tip="Loading..." />
      ) : (
        <List
          className="user-list"
          itemLayout="horizontal"
          dataSource={filteredData}
          renderItem={renderItem}
        />
      )}
    </div>
  );
};

export default ChatListUserScreen;
