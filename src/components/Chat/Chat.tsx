"use client";

import { useEffect, useState, useRef } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import useGetClient from '@/graphql/getClients';
import useGetConversationList from '@/graphql/getListofConversation';
import { useUserStore } from '@/store/user/userStore';
import moment from 'moment';
import { Avatar, Badge, Button, List, Typography, Spin, Input, Card } from 'antd';
import Image from 'next/image';

import './style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRefresh, faSearch } from '@fortawesome/free-solid-svg-icons';
import useGetUserList from '@/graphql/getUserList';
import { UserNode } from '../AdminSearch/types/getUserList';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import useConversationData from '@/graphql/getConversationId';
import { useAddUsersToConversationMutation, useCreateNewConversationMutation, useCreateNewMessageMutation, useUpdateConversationDateMutation } from '@/gql/_generated';
import { formatDateToDB } from '@/utils/date';

const { Text } = Typography;

const formatChatTime = (time: string): string => {
  const now = moment();
  const messageTime = moment(time);

  if (now.isSame(messageTime, 'day')) {
    return messageTime.format('h:mm A');
  } else if (now.isSame(messageTime, 'year')) {
    return messageTime.format('MMM D');
  } else {
    return messageTime.format('MMM D, YYYY');
  }
};

interface ChatItemProps {
  item: {
    receiverID: string;
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    avatar: string;
    conversationUpdatedDate: Date;
    unreadCount?: number;
    sentMessages?: string[];
  };
}

interface ChatData {
  receiverID: string;
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  conversationUpdatedDate: Date;
  unreadCount?: number;
}

type Message = {
  id: string;
  text: string | null | undefined;
  isSender: boolean;
  createdAt: string;
};

const Chat = () => {
  const { userId, setUserId } = useUserStore();
  const [chatData, setChatData] = useState<ChatData[]>([]);
  const {dataUserList, errorUserList, isLoadingUserList} = useGetUserList();
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null);
  const { dataConversation, errorConversation, isLoadingConversation } = useConversationData(userId || '');
  console.log('dataConversation', dataConversation);
  const [isRefreshing, setIsRefreshing] = useState(false);
  //const [messages, setMessages] = useState<string>('');
  const [sentMessages, setSentMessages] = useState<{ [key: string]: string[] }>({});
  const talkContainer = useRef<HTMLDivElement>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [structuredData, setStructuredData] = useState<UserNode[]>([]);
  const [filteredData, setFilteredData] = useState<UserNode[]>([]);
  const [showUserList, setShowUserList] = useState(false);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationID, setConversationID] = useState<string | undefined>(undefined);
  const conversationIDRef = useRef(conversationID);

  console.log('conversationId', conversationID);
 
  const socketRef = useRef<Socket | null>(null);

  const { client, errorClient, isLoadingClient } = useGetClient();

  useEffect(() => {
    if (dataUserList) {
      setStructuredData(dataUserList);
      // Transform chatData to UserNode structure and set it to filteredData
      const chatDataAsUsers: UserNode[] = chatData.map((chat) => ({
        id: chat.receiverID,
        name: chat.name,
        email: '',
        phoneNumber: '',
        jobTitle: '',
        summaryBio: '',
        profile: {
          photo: chat.avatar || '/images/default-avatar.png',
        },
        availables: {
          nodes: [],
          totalCount: 0,
        },
        reviews: {
          nodes: [],
          totalCount: 0,
        },
        fillupForms: {
          nodes: [],
          totalCount: 0,
        },
      }));
      setFilteredData(chatDataAsUsers);
    }
  }, [dataUserList, chatData]);

  useEffect(() => {
    if (dataConversation && selectedChat) {
      const resultConvoID = getConversationIdIfBothUsersInConversation(selectedChat.receiverID);
  
      if (resultConvoID) {
        // Load messages for the existing conversation
        loadMessages(resultConvoID);
        setConversationID(resultConvoID); // Use the existing conversation ID
      } else {
        // If no existing conversation, create a new one
        saveConversation.mutate({
          input: {
            conversation: {
              createdBy: userId,
              createdAt: formatDateToDB(new Date()),
              updatedAt: formatDateToDB(new Date()),
            },
          },
        }, {
        });
      }
    }
  }, [dataConversation, selectedChat]);

  useEffect(() => {
    conversationIDRef.current = conversationID;
    console.log('con 1', conversationIDRef.current);
  }, [conversationID]);

  useEffect(() => {
    if (searchQuery) {
      filterDataBySearchQuery(searchQuery);
      setShowUserList(true);
    } else {
      setShowUserList(false); 
      const chatDataAsUsers: UserNode[] = chatData.map((chat) => ({
        id: chat.receiverID,
        name: chat.name,
        email: '',
        phoneNumber: '',
        jobTitle: '',
        summaryBio: '',
        profile: {
          photo: chat.avatar || '/images/default-avatar.png',
        },
        availables: {
          nodes: [],
          totalCount: 0,
        },
        reviews: {
          nodes: [],
          totalCount: 0,
        },
        fillupForms: {
          nodes: [],
          totalCount: 0,
        },
      }));
      setFilteredData(chatDataAsUsers); // Show chat data instead
    }
  }, [searchQuery, chatData]);

  const filterDataBySearchQuery = (query: string) => {
    const filteredUsers = structuredData?.filter(user =>
      user.name?.toLowerCase().includes(query.toLowerCase())
    );

    const filteredChats = chatData?.filter(chat =>
      chat.name.toLowerCase().includes(query.toLowerCase())
    );

    // Combine both filtered users and chat data
    const combinedResults = [...(filteredUsers ?? []), ...(filteredChats ?? [])];
  
    setFilteredData(combinedResults.filter((item): item is UserNode => 'email' in item));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserID = localStorage.getItem('userID');
      if (storedUserID) {
        setUserId(storedUserID);
      }
    }
  }, []);

  const {
    dataChatList,
    errorChatList,
    isLoadingChatList,
    fetchChatList,
  } = useGetConversationList(userId || '');

  useEffect(() => {
    if (dataChatList) {
      loadFormattedChatList(dataChatList);
    }
  }, [dataChatList]);

  const loadFormattedChatList = (data: any) => {
    const formattedChatData = data
      ?.map((chat: any) => {
        const lastMessageNode = chat?.conversation?.messages?.nodes?.[0];
        const lastMessage = lastMessageNode?.messageText || '';
        const time = lastMessageNode?.createdAt || '';

        const userNode = chat?.conversation?.conversationUsers?.nodes?.[0];
        const receiveId = userNode?.userId || '';
        const name = userNode?.user?.name || '';
        const avatar = userNode?.user?.profile?.photo || '';

        const conversationUpdatedDate = chat?.conversation?.updatedAt || '';

        if (lastMessageNode) {
          return {
            receiverID: receiveId,
            id: chat?.conversationId,
            name: name,
            lastMessage: lastMessage,
            time: formatChatTime(time),
            avatar: avatar,
            conversationUpdatedDate: new Date(conversationUpdatedDate),
          };
        }
        return null;
      })
      .filter((chat: any) => chat !== null)
      .sort(
        (a: any, b: any) => b.conversationUpdatedDate - a.conversationUpdatedDate
      );

    setChatData(formattedChatData);
  };

  const handleUserPress = (item: ChatData | UserNode) => {
    const isChatItem = (item: ChatData | UserNode): item is ChatData => 'id' in item; 
  
    if (!isChatItem(item)) {
      const newChatData: ChatData = {
        receiverID: item.id,
        id: `new-${item.id}`,
        name: item.name,
        lastMessage: '',
        time: '',
        avatar: item?.profile?.photo || '/images/default-avatar.png', 
        conversationUpdatedDate: new Date(),
      };
      setChatData([newChatData, ...chatData]);
      setSelectedChat(newChatData);

    } else {
      // Existing chat item: Proceed with opening the conversation
      setSelectedChat(item);

    }
  };

  const ChatItem = ({ item }: ChatItemProps) => (
    <List.Item className="chatItem" onClick={() => handleUserPress(item)}>
      <List.Item.Meta
        avatar={<Avatar src={item.avatar ? item.avatar : '/images/default-avatar.png'} />}
        title={<Text strong>{item.name}</Text>}
        description={
          <div>
            <Text type="secondary" className="lastMessage">
              {item.lastMessage}
            </Text>
            {item.unreadCount && item.unreadCount > 0 && (
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

    if (userId) {
      try {
        const refreshedData = await fetchChatList(client, userId);
        loadFormattedChatList(refreshedData);
      } catch (error) {
        alert('Error: Failed to refresh chat list.');
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");
    
    const handleReceiveMessage = (messageData: { senderId: string, messageText: string, chatId: string }) => {
      if (messageData.senderId !== userId) {
        // Update the lastMessage and conversationUpdatedDate when a new message is received
        setChatData((prevChatData) =>
          prevChatData.map((chat) => {
            if (chat.id === messageData.chatId) {
              return {
                ...chat,
                lastMessage: messageData.messageText, // Set the last message to the received message
                conversationUpdatedDate: new Date(), // Update the conversation date to now
                time: formatChatTime(new Date().toISOString()), // Update time to the current time
              };
            }
            return chat;
          })
        );
        
        // Optionally, you can also add the new message to the sentMessages state if needed
        setSentMessages((prev) => ({
          ...prev,
          [messageData.chatId]: [...(prev[messageData.chatId] || []), messageData.messageText],
        }));
      }
    };
    
    socketRef.current.on("receiveMessage", handleReceiveMessage);
  
    return () => {
      socketRef.current?.off("receiveMessage", handleReceiveMessage);
      socketRef.current?.disconnect();
    };
  }, [userId]);
  

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      if (conversationID) {
        console.log('convoid ', conversationID);
      const chatId = selectedChat.id;
      const newMessage = message.trim();

      insertToMessages(message);
      
      setSentMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMessage],
      }));
      
      socketRef.current?.emit("sendMessage", {
        senderId: userId,
        messageText: newMessage,
        chatId,
        receiverId: selectedChat.receiverID,
      });
      
      setMessage(''); // Clear the message input
    }
  }
  };

  const saveConversationUser = useAddUsersToConversationMutation(client, {
    onSuccess: async data => {
      //nanti try disable send button till this process finish
    },
    onError: async (error, variables, context) => {
      throw new Error('error from adding user to conversation user');
    },
  });

  const createNewConversationUser = async (convoID: any, receiverID: string) => {
    const formattedDate = formatDateToDB(new Date());
  
    try {
      await saveConversationUser.mutate({
        input: {
          conversationUser: {
            conversationId: convoID,
            userId: userId,
            createdAt: formattedDate,
            updatedAt: formattedDate,
          },
        },
      });
      setConversationID(convoID);
    } catch (e) {
      throw new Error('error from adding user to conversation user');
    }
  };

  const saveConversation = useCreateNewConversationMutation(client, {
    onSuccess: async data => {
      const convoID = data?.createConversation?.conversation?.id;
      console.log('convoID', convoID);

      if (convoID) {
        await createNewConversationUser(convoID, selectedChat?.receiverID || '');
      }
    },
    onError: async (error, variables, context) => {
      throw new Error('error from creating new message');
    },
  });
  
  const updateConversationDate = useUpdateConversationDateMutation(client, {

    onSuccess: data => {console.log('success updating conversation date')},
    onError: async (error, variables, context) => {
      throw new Error('error from updating conversation date');
    },
  });

  const saveMessage = useCreateNewMessageMutation(client, {
    onSuccess: async data => {
      const isSender = data?.createMessage?.message?.senderId === userId;
      const returnedData: Message = {
        id: data?.createMessage?.message?.id,
        text: data?.createMessage?.message?.messageText,
        isSender: isSender,
        createdAt: data?.createMessage?.message?.createdAt,
      };

      if(conversationID){
        await updateConversationDate.mutate({
          patch: {
            id: conversationID,
            patch: {
              updatedAt: formatDateToDB(new Date()),
            }
           
          },
        });
      }
      setMessages(prevMessages => [...prevMessages, returnedData]); 
    },
    onError: async (error, variables, context) => {
      throw new Error('error from creating new message');
    },
  });

  const insertToMessages = async (message: any) => {
    const formattedDate = formatDateToDB(new Date());

    try {
      await saveMessage.mutate({
        input: {
          message: {
            conversationId: conversationIDRef.current,
            senderId: userId,
            messageText: message,
            createdAt: formattedDate,
            updatedAt: formattedDate,
          },
        },
      });
      console.log('convoid 2', conversationIDRef.current);
    } catch (e) {
      throw new Error('error from saving message');
    }
  };

  const getConversationIdIfBothUsersInConversation = (receiverID: string): string | null => {
    const existingConversation = dataConversation?.find((conversation: any) => {
      return conversation?.conversationUsers?.some((user: any) => 
        user.userId === receiverID || user.userId === userId
      );
    });
  
    return existingConversation?.conversationId || null;
  };

  const loadMessages = (convoID: any) => {
    const conversationData = dataConversation?.find(
      convo => convo.conversationId === convoID,
    );

    if (conversationData?.conversation?.messages) {
      const formattedMessages =
        conversationData.conversation.messages.nodes.map(message => {
          const isSender = message.senderId === userId;
          return {
            id: message.id,
            text: message.messageText,
            isSender: isSender,
            createdAt: message.createdAt,
          };
        });

      setMessages(formattedMessages);
      setConversationID(convoID); 
    }
  };

  // Combine sent messages and conversation history from the data
  const renderMessages = () => {
    if (isLoadingConversation) return <Spin />;

    // Fetch messages from the API response
    const receivedMessages = dataConversation?.flatMap(conversation => conversation.conversation?.messages?.nodes) || [];

    // Get sent messages from the local state
    const localSentMessages = sentMessages[selectedChat?.id || ''] || [];
  };

  const combinedMessages = [
    ...(dataConversation?.flatMap(conversation => conversation.conversation?.messages?.nodes) || []).map((msg: any) => ({
      senderId: msg.senderId,
      messageText: msg.messageText,
      timestamp: msg.createdAt,
    })),
    ...(sentMessages[selectedChat?.id || ''] || []).map((msg) => ({
      senderId: userId,
      messageText: msg,
      timestamp: new Date().toISOString(),
    }))
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Set search query based on input value
  
    if (e.target.value) {
      const filteredUsers: UserNode[] = structuredData.filter((user) =>
        user?.name?.toLowerCase().includes(e.target.value.toLowerCase())
      );
  
      // Transform chatData to UserNode structure and filter
      const filteredChatsAsUsers: UserNode[] = chatData.map((chat) => ({
        id: chat.receiverID,
        name: chat.name,
        email: '',
        phoneNumber: '',
        jobTitle: '',
        summaryBio: '',
        profile: {
          photo: chat.avatar || '/images/default-avatar.png',
        },
        availables: {
          nodes: [], 
          totalCount: 0,
        },
        reviews: {
          nodes: [], 
          totalCount: 0, 
        },
        fillupForms: {
          nodes: [], 
          totalCount: 0, 
        },
      })).filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
  
      // Merge the filtered results
      const mergedResults = [...filteredUsers, ...filteredChatsAsUsers];
  
      setFilteredData(mergedResults); // Set the merged data to filteredData
    } else {
      // Reset to full list of chats when search query is cleared
      const chatDataAsUsers: UserNode[] = chatData.map((chat) => ({
        id: chat.receiverID,
        name: chat.name,
        email: '',
        phoneNumber: '',
        jobTitle: '',
        summaryBio: '',
        profile: {
          photo: chat.avatar || '/images/default-avatar.png',
        },
        availables: {
          nodes: [],
          totalCount: 0,
        },
        reviews: {
          nodes: [],
          totalCount: 0,
        },
        fillupForms: {
          nodes: [],
          totalCount: 0,
        },
      }));
  
      setFilteredData(chatDataAsUsers); // Set default chat list as UserNode array
    }
  };

  return (
    <div className="container">
      <Breadcrumb pageName="Chat" />

      <div className="flex space-x-4 bg-white">
        {/* Left side: Chat List */}
        <div className="flex-[0.3]" style={{ padding: '20px', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}>
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
            <div className="chatList">
            <List
        itemLayout="horizontal"
        dataSource={showUserList ? filteredData.map(user => ({
          receiverID: selectedChat?.receiverID || '',
          id: `new-${user.id}`,
          name: user.name,
          lastMessage: '',
          time: '',
          avatar: user.profile?.photo || '/images/default-avatar.png',
          conversationUpdatedDate: new Date(),
        })) : chatData}
        renderItem={item => <ChatItem item={item} />}
        loading={isLoadingUserList}
      />
          </div>
        </div>

        {/* Right side: Chat Conversation */}
        <div className="flex-[0.7]" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '500px' }}>
          {selectedChat ? (
            <>
              {/* Chat conversation header */}
              <div>
                <h2 className="text-black font-bold text-xl">{selectedChat.name}</h2>
                
              </div>

              {/* TalkJS Chat UI */}
              <div
                ref={talkContainer} // TalkJS UI will be mounted here
                style={{ flex: 1, border: '1px solid #f0f0f0', overflowY: 'auto', marginTop:'10px', marginBottom: '20px', height: '500px' }}
              >
              {selectedChat?.lastMessage && (
                <div>
                  <Card className="chat-bubble" style={{ marginTop: '10px', marginLeft: '10px' }}>
                    <p className="text-black">{selectedChat.lastMessage}</p>
                  </Card>
                  </div>
                )}

                {combinedMessages.map((msg, index) => (
                  <div key={index} className={`message ${msg.senderId === userId ? 'sent' : 'received'}`} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="messageSent" key={index} >
                    <Card className="sender-bubble" style={{ marginTop: '10px', marginRight: '10px' }}>
                      <p className="text-white">{msg.messageText}</p>
                    </Card>
                    </div>
                    <div>
                      <small className="time-format">{formatChatTime(msg.timestamp)}</small>
                      </div>
                  </div>
                ))}

              </div>

              {/* Input Box for sending messages */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderMessages()}
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPressEnter={sendMessage}
                placeholder="Type your message..."
                style={{ flex: 1, marginRight: '10px' }}
              />
              <Button className="sendButton text-white" type="primary" onClick={sendMessage}>
                <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '5px' }} />
              </Button>
              
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100vh' }}>
              <Image src="/images/logo/SansPaperID.svg" alt="Logo" width={205} height={180} />
              <h1 className="mt-5">Download Sans Paper ID Mobile on PlayStore and AppleStore</h1>
              <p>Chat with your Colleagues, Employers, or Employees with just one app!</p>
              <Button onChange={handleSearchChange} className="downloadButton">
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