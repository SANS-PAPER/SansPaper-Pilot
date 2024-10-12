import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Input, Typography } from 'antd';
import './style.css'; // You will create this file for CSS
import useGetClient from '@/graphql/getClients';
import useConversationData from '@/graphql/getConversationId';
import {User } from './types/getListofConversation';
import io from 'socket.io-client';
import { useAddUsersToConversationMutation, useCreateNewConversationMutation, useCreateNewMessageMutation, useUpdateConversationDateMutation } from '@/gql/_generated';
import { formatDateToDB } from '@/utils/date';
import useGetConversationList from '@/graphql/getListofConversation';
import { UserNode } from '../AdminSearch/types/getUserList';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '@/store/user/userStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Text } = Typography;

const socket = io(`${process.env.NEXT_PUBLIC_CHAT_SERVER_URL_STAGING}`, {
  transports: ['websocket'],
});

type Message = {
  id: string;
  text: string | null | undefined;
  isSender: boolean;
  createdAt: string;
};

interface ChatBubbleProps {
  userId : string | '';
  receiverID: string;
  profileData: UserNode;
  onMessageSent: (message: string, time: string) => void ; // Add this line
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ userId, receiverID, profileData, onMessageSent  }) => {
  const { client, errorClient, isLoadingClient } = useGetClient();
  const {dataConversation, errorConversation, isLoadingConversation} =
      useConversationData([userId, receiverID]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationID, setConversationID] = useState<string | null>(null);
  const conversationIDRef = useRef(conversationID);
  const { addConversation, addMessage } = useUserStore();

  useEffect(() => {
    conversationIDRef.current = conversationID;
  }, [conversationID]);

  useEffect(() => {
    if (dataConversation) {
      const resultConvoID = getConversationIdIfBothUsersInConversation();

      if (!conversationID && !resultConvoID) {
        createNewConversation();
      } else if (resultConvoID) {
        setConversationID(resultConvoID);
        loadMessages(resultConvoID);
      }
    } else if (errorConversation) {
      console.error('Error retrieving conversation data:', errorConversation);
    }
  }, [dataConversation]); 
  

//   useEffect(() => {
//     if (profileData?.name) {
//       <h2 className="text-black font-bold text-xl">{profileData?.name}</h2>
      
//     }
//   }, [profileData?.name]);

useEffect(() => {
  socket.on('chat message', (msg) => {
    const isSender = msg.senderId === userId;
    const newMessage: Message = {
      id: msg.id,
      text: msg.text,
      isSender: msg.senderId.toString() === userId.toString(),
      createdAt: msg.createdAt,
    };

    // Update the local messages state with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Show a notification if the message is received from another user
    if (!isSender) {
      toast.info(`New message from ${profileData.name}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  });

  return () => {
    socket.off('chat message');
  };
}, [profileData]);


  const getConversationIdIfBothUsersInConversation = () => {
    if (!dataConversation) return null;
  
    const userConversations = dataConversation.reduce((acc: { [key: string]: string[] }, node) => {
      if (!acc[node.conversationId]) {
        acc[node.conversationId] = [];
      }
      acc[node.conversationId].push(node.userId);
      return acc;
    }, {} as { [key: string]: string[] });
  
    for (const conversationId in userConversations) {
      const userIds = userConversations[conversationId];
      
      if (userIds.includes(String(userId)) && userIds.includes(String(receiverID))) {
        return conversationId;  // Return the conversationId where both users are present
      }
    }    
  
    return null; // Return null if no conversation is found
  };

  const createNewConversation = async (): Promise<string | null> => {
    if (conversationIDRef.current) {
      // If conversationID already exists, prevent creating a new one
      return conversationIDRef.current;
    }
  
    const formattedDate = formatDateToDB(new Date());
    try {
      const response = await saveConversation.mutateAsync({
        input: {
          conversation: {
            createdBy: userId,
            createdAt: formattedDate,
             updatedAt: formattedDate, // Removed as it does not exist in the Conversation type
          },
        },
      });
  
      const newConversationID = response?.createConversation?.conversation?.id;
      if (newConversationID) {
        await createNewConversationUser(newConversationID);  // Add users to the new conversation
  
        // Add the new conversation to the chat list
        addConversation({
          conversationID: newConversationID,
          receiverID: receiverID,
          name: profileData.name,
          lastMessage: '',  // Start with no message
          updatedAt: formattedDate,
        });
  
        setConversationID(newConversationID);
        conversationIDRef.current = newConversationID;  // Update the ref to prevent future creation
        return newConversationID;
      }
    } catch (e) {
      console.error('Error creating new conversation', e);
    }
  
    return null;  // Return null if the conversation creation fails
  };
  
  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: new Date().toISOString(), // Temporary ID
        text: message,
        isSender: true, // Since it's the sender's message
        createdAt: new Date().toISOString(),
      };
  
      // Emit the message to the server
      if (conversationIDRef.current) {
        socket.emit('chat message', {
          text: message,
          senderId: userId.toString(),
          conversationId: conversationIDRef.current,
        });
  
        // Save the message in the database
        await insertToMessages(message);
        setMessage(''); // Clear the input field
  
        // Notify the parent component after sending
        const sentTime = new Date().toISOString();
        onMessageSent(message, sentTime);
      } else {
        const newConvoID = await createNewConversation();
        if (newConvoID) {
          await insertToMessages(message);
          setMessage(''); // Clear the input field
  
          // Notify the parent component after sending
          const sentTime = new Date().toISOString();
          onMessageSent(message, sentTime);
        } else {
          alert('Unable to create a conversation');
        }
      }
    }
  };  
  
  const loadMessages = (convoID: any) => {
    // Find the conversation that matches the passed convoID
    const conversationData = dataConversation?.find(
      convo => convo.conversationId === convoID,
    );

    // Check if the conversation and its messages exist
    if (conversationData?.conversation?.messages) {
      const formattedMessages =
        conversationData.conversation.messages.nodes.map(message => {
          const isSender = message.senderId.toString() === userId.toString();
          return {
            id: message.id,
            text: message.messageText,
            isSender: isSender,
            createdAt: message.createdAt,
          };
        });

      setMessages(formattedMessages.map(message => ({
        ...message,
        createdAt: message.createdAt.toString(),
      })) as Message[]);
      setConversationID(convoID); // Set the conversationID to the convoID that was passed
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

  const createNewConversationUser = async (convoID: string) => {
    const formattedDate = formatDateToDB(new Date());

    try {
      await Promise.all([
        saveConversationUser.mutateAsync({
          input: {
            conversationUser: {
              conversationId: convoID,
              userId: userId,
              createdAt: formattedDate,
              updatedAt: formattedDate,
            },
          },
        }),
        saveConversationUser.mutateAsync({
          input: {
            conversationUser: {
              conversationId: convoID,
              userId: receiverID,
              createdAt: formattedDate,
              updatedAt: formattedDate,
            },
          },
        }),
      ]);

      setConversationID(convoID); // Update conversationID after adding users
    } catch (e) {
      console.error('Error adding users to new conversation', e);
    }
  };

  const saveConversation = useCreateNewConversationMutation(client, {
    onSuccess: async data => {
      const convoID = data?.createConversation?.conversation?.id;

      if (convoID) {
        await createNewConversationUser(convoID);
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
      const isSender = data?.createMessage?.message?.senderId === userId.toString();
      const returnedData: Message = {
        id: data?.createMessage?.message?.id,
        text: data?.createMessage?.message?.messageText ?? '',
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
      setMessages(prevMessages => [...prevMessages, returnedData]); // Append the new message to the existing messages
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
            senderId: userId.toString(),
            messageText: message,
            createdAt: formattedDate,
            updatedAt: formattedDate,
          },
        },
      });


    } catch (e) {
      // await deleteUserRecord(userId);
      throw new Error('error from saving message');
    }
  };

  return (
    <div className="chat-container">
      {/* Notification container */}
      <ToastContainer />
      
      <div className="messages">
        {messages.map((item: any) => (
          <div
            key={item.id}
            className={`message-container ${item.isSender ? 'sender' : 'receiver'}`}
          >
            <div className={`message-content ${item.isSender ? 'sender-bubble' : 'chat-bubble'}`}>
              <p className="message-text">
                {item.text}
              </p>
              <span className="time-text">
                {new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="inputContainer">
        <Input
          type="text"
          placeholder="Type a message"
          value={message}
          onPressEnter={sendMessage}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, marginRight: '10px' }}
        />
        <Button className="sendButton text-white" type="primary" onClick={sendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} style={{ marginRight: '5px' }} />
        </Button>
      </div>
    </div>
  );
};  

export default ChatBubble;
