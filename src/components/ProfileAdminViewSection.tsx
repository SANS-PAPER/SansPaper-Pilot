import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Image,
  Avatar,
  
} from 'antd'; // Use web equivalents here
//import { useNavigate } from 'react-router-dom';
//import { ProfileIcon } from 'assets/svg/ProfileIcon'; 
import useGetClient from '@/graphql/getClients';
import { useUpdateProfileMutation } from '@/gql/_generated';
import AWS from 'aws-sdk';
//import Icon from 'react-icons/lib/md/star';
import {Icon, Spinner} from '@chakra-ui/react'
import { UserNode } from './AdminSearch/types/getUserList';
import { useSearchParams } from 'next/navigation';
import '@/css/ProfileAdminViewSection.css';
import { UserOutlined } from '@ant-design/icons';

const PROFILE_WIDTH = 53;
const PROFILE_HEIGHT = 53;
const PROFILE_RADIUS = 26.5;

interface ProfileAdminViewProps {
  userID: string | '';
  receiverID: string;
  profileData: UserNode; 
  dataUser : any;
}

const ProfileAdminViewSection = () => {
  const searchParams = useSearchParams();  // Using next/navigation
  const [userID, setUserID] = useState<string | null>(null);
  const [receiverID, setReceiverID] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserNode | null>(null);
  const { client } = useGetClient();
  const [avatar, setAvatar] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
   
  const userIDString = searchParams.get("userID") || '';
  const receiverIDString = searchParams.get("receiverID");
  const profileDataString = searchParams.get("profileData");

    if (receiverIDString && profileDataString) {
      setUserID(userIDString);
      setReceiverID(receiverIDString);

      try {
        const parsedProfileData = JSON.parse(profileDataString);
        console.log('parsedProfileData:', parsedProfileData);
        setProfileData(parsedProfileData);
      } catch (error) {
        console.error("Error parsing profileData:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (profileData) {
      if (profileData?.profile?.photo) {
        setAvatar(
          <img
            src={profileData?.profile?.photo}
            alt="Profile"
          />
        );
      } else {
        setAvatar(
          <Avatar />
        );
      }
    } else {
      setAvatar(<Spinner animation="border" />);
    }
  }, [profileData]);
  
  const handleOpenPicker = async (type:any) => {
    let input;
    
    if (type === 1) {
      input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
    } else {
      input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
    }
  
    input.onchange = (event) => {
      if (event.target) {
        const input = event.target as HTMLInputElement;
        const file = input.files ? input.files[0] : null;
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            if (e.target) {
              const imageUrl = e.target.result;
              uploadPhoto(file); 
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };
  
    input.click(); 
  
    setShowModal(false);
  };

  const uploadPhoto = async (file: any) => {
    // Replace with web file upload logic
    const s3 = new AWS.S3({
      endpoint: new AWS.Endpoint(process.env.DIGITAL_OCEAN_ENDPOINT!),
      accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY,
      secretAccessKey: process.env.DIGITAL_OCEAN_SECRET_KEY,
      region: process.env.DIGITAL_OCEAN_REGION,
    });

    try {
      const params = {
        Bucket: process.env.DIGITAL_OCEAN_SPACE_NAME,
        Key: file.name,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type,
      };
    //   const data = await s3.upload(params).promise();
    //   console.log('Successfully uploaded image to DigitalOcean', data);
      handleUpdateProfilePic(`${process.env.DIGITAL_OCEAN_FILE_PATH}/${file.name}`);
    } catch (error) {
      console.error('Error uploading image: ', error);
    }
  };

  const mutateProfile = useUpdateProfileMutation(client, {
    onSuccess: () => {
      alert('Profile Pic updated successfully');
    },
    onError: () => {
      setAvatar(
        <Avatar
          size={60}
          style={{ backgroundColor: '#6733b9' }}
          icon={<UserOutlined />}
        />
      );
      alert('Error updating profile pic');
    },
  });

  const handleUpdateProfilePic = async (filename:any) => {
    if (!client) {
      alert('GraphQL client not initialized for update photos');
      return;
    }

    try {
      await mutateProfile.mutate({
        patch: {
          id: userID,
          patch: {
            photo: filename,
          },
        },
      });

      setAvatar(
        <img
          src={filename}
          alt="Updated Profile"
        />
      );
    } catch (error) {
      console.error('Error updating profile pic:', error);
    }
  };

  const getPhotos = (photo: string | null | undefined) => {
    if (!photo) {
      return (
        <Avatar
          size={100}
          style={{ backgroundColor: '#6733b9' }}
          icon={<UserOutlined />}
        />
      );
    } else {
      return <Avatar size={100} src={photo} />;
    }
  };

  return (
    <div className="centered-container">
      <div>
      <div className="flex">
            {getPhotos(profileData?.profile?.photo)}
          </div>
      </div>

      <div >
        <div >
          <div >
            <p className=" font-medium">
              {profileData?.email}
            </p>
            <div className="text-black font-bold text-xl">
              {profileData?.name}
            </div>
          </div>
        </div>
      </div>
      <div >
        <p >RANKING</p>
        <div >
          <p>
            {profileData?.reviews?.totalAverageCount && profileData.reviews.totalAverageCount > 0
              ? profileData.reviews.totalAverageCount
              : null}
          </p>
          {profileData?.reviews?.totalAverageCount && Array.from({ length: profileData.reviews.totalAverageCount }).map(
            (_, index) => (
              <Icon key={index} color="#ffd700" />
            )
          )}
        </div>
        <div className="button">
         
              <Button  className="messageButton bg-purple-900">
              Message
            </Button>
             
        </div>
      </div>

      {/* MODAL FOR PHOTO */}
      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
      >
        <div >
          <p>Select Options</p>
          <button onClick={() => handleOpenPicker(1)}>Open Camera</button>
          <button onClick={() => handleOpenPicker(2)}>Choose from Image Gallery</button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileAdminViewSection;
