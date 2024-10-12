"use client";

import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import Image from 'next/image';
import './style.css';
import { Avatar, Badge, Button, Input, List, Spin, Typography } from 'antd';
import { useUserStore } from '@/store/user/userStore';
import { useEffect, useState } from 'react';
import useGetConversationList from '@/graphql/getListofConversation';
import { formatChatTime } from '@/utils/date';
import useGetClient from '@/graphql/getClients';
import ChatBubble from './ChatBubble';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import ChatListUser from './ChatListUser';


const { Text } = Typography;

const Chat = () => {
  const { userId, setUserId } = useUserStore();
  const [chatData, setChatData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { client, errorClient, isLoadingClient } = useGetClient();
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const receiverID = selectedChat?.receiverID;
  const [searchQuery, setSearchQuery] = useState('');

  const { dataChatList, errorChatList, isLoadingChatList, fetchChatList } = useGetConversationList(userId || '');

  useEffect(() => {
    if (dataChatList) {
      loadFormattedChatList(dataChatList);
    }
  }, [dataChatList]);
  
  const loadFormattedChatList = (data: any) => {
    const chatMap: { [key: string]: any } = {};
  
    data.forEach((chat: any) => {
      const lastMessageNode = chat?.conversation?.messages?.nodes?.[0];
      const unreadCount = chat?.conversation?.unreadCount || 0; // Assuming unreadCount is provided by the API
  
      if (lastMessageNode) {
        const lastMessage = lastMessageNode?.messageText || '';
        const time = lastMessageNode?.createdAt || '';
        const userNode = chat?.conversation?.conversationUsers?.nodes?.[0];
        const receiveId = userNode?.userId || '';
        const name = userNode?.user?.name || '';
        const avatar = userNode?.user?.profile?.photo || '';
        const conversationUpdatedDate = chat?.conversation?.updatedAt || '';
  
        const conversationId = chat?.conversationId;
  
        if (!chatMap[conversationId]) {
          chatMap[conversationId] = {
            receiverID: receiveId,
            id: conversationId,
            name: name,
            lastMessage: lastMessage,
            time: formatChatTime(time),
            avatar: avatar,
            conversationUpdatedDate: new Date(conversationUpdatedDate),
            unreadCount: unreadCount, // Add unread count here
          };
        } else {
          if (new Date(conversationUpdatedDate) > chatMap[conversationId].conversationUpdatedDate) {
            chatMap[conversationId].lastMessage = lastMessage;
            chatMap[conversationId].time = formatChatTime(time);
            chatMap[conversationId].conversationUpdatedDate = new Date(conversationUpdatedDate);
            chatMap[conversationId].unreadCount = unreadCount; // Update unread count if newer
          }
        }
      }
    });
  
    const formattedChats = Object.values(chatMap).sort(
      (a: any, b: any) => b.conversationUpdatedDate - a.conversationUpdatedDate
    );
  
    setChatData(formattedChats);
  };
  

  const handleUserPress = (item: any) => {
    if (userId && item) {
      setSelectedChat(item); 
      setSearchQuery(''); 
    } else {
      alert('Something went wrong, please refresh the page');
    }
  };

  const ChatItem = ({ item }: { item: any }) => (
    <List.Item onClick={() => handleUserPress(item)}>
      <List.Item.Meta
        avatar={<Avatar src={item.avatar} />}
        title={<span>{item.name}</span>}
        description={
          <div>
            <Text type="secondary" className="lastMessage">
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <Badge count={item.unreadCount} className="badge" />
            )}
          </div>
        }
      />
      <Text type="secondary" className="time">
        {item.time}
      </Text>
    </List.Item>
  );
  

  const onRefresh = async () => {
    setIsRefreshing(true);
    setChatData([]);
  
    try {
      if (userId) {
        const refreshedData = await fetchChatList(client, userId);
        loadFormattedChatList(refreshedData);
      }
    } catch (error) {
      alert('Failed to refresh chat list.');
    } finally {
      setIsRefreshing(false);
    }
  };
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const renderItem = (item: any) => (
    <ChatItem item={item} />
  );

  const updateLastMessage = (message: string, time: string) => {
    // Update the selected chat's last message
    setChatData((prevData) =>
      prevData.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, lastMessage: message, time: formatChatTime(time) }
          : chat
      )
    );
  };

  return (
    <div className="container">
      <Breadcrumb pageName="Chat" />

      <div className="flex space-x-4 bg-white" >
        {/* Left side: Chat List */}
        <div className="flex-[0.3]" style={{ padding: '20px', borderRight: '1px solid #f0f0f0', overflowY: 'auto', height:'600px' }}>
          {/* Search function */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              suffix={
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ color: '#462F8E', cursor: 'pointer' }} 
                />
              }
              style={{ width: '300px', borderColor: '#462F8E', marginRight: '10px' }} 
            />
            
            {(isRefreshing || isLoadingChatList) && <Spin tip="Loading..." />}
            <Button type="primary" onClick={onRefresh} className="refreshButton">
            <FontAwesomeIcon icon={faRefresh} />
            </Button>
          </div>
          {searchQuery && (
            <ChatListUser searchQuery={searchQuery} setSelectedChat={setSelectedChat} setSearchQuery={setSearchQuery} />
          )}

        
            <div className="chatList" style={{ overflowY: 'auto'}}>
            <List
            className="chatList"
            itemLayout="horizontal"
            dataSource={chatData} // Use the full chatData
            renderItem={renderItem} // Render each chat item
          />
          </div>
        </div>

        {/* Right side: Chat Conversation */}
        <div className="flex-[0.7]" style={{ padding: '20px', display: 'flex', flexDirection: 'column'}}>
          {selectedChat ? (
            <>
              {/* Chat conversation header */}
              <div className="flex">
                <Avatar src={selectedChat?.avatar} />
                <h2 className="text-black font-bold text-xl ml-2">{selectedChat.name}</h2>
              </div>

              {/* TalkJS Chat UI */}
              <div
                style={{ marginTop:'10px', marginBottom: '20px'}}
              >
              <ChatBubble userId={userId || ''} receiverID={receiverID} profileData={selectedChat} onMessageSent={updateLastMessage}/>

              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100vh' }}>
              <Image src="/images/logo/SansPaperID.svg" alt="Logo" width={205} height={180} />
              <h1 className="mt-5">Download Sans Paper ID Mobile on PlayStore and AppleStore</h1>
              <p>Chat with your Colleagues, Employers, or Employees with just one app!</p>
              <Button className="downloadButton">
               Download Your App Here!
            </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;