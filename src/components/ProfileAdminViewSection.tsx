import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  Image,
  Avatar,
  
} from 'antd'; // Use web equivalents here
import { useNavigate } from 'react-router-dom';
//import { ProfileIcon } from 'assets/svg/ProfileIcon'; 
import useGetClient from '@/graphql/getClients';
import { useUpdateProfileMutation } from '@/gql/_generated';
import AWS from 'aws-sdk';
//import Icon from 'react-icons/lib/md/star';
import {Icon, Spinner} from '@chakra-ui/react'

const PROFILE_WIDTH = 53;
const PROFILE_HEIGHT = 53;
const PROFILE_RADIUS = 26.5;

const ProfileAdminViewSection = ({ userID }: { userID: string }, profileData: any) => {
  const navigate = useNavigate();
  const { client } = useGetClient();
  const [avatar, setAvatar] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (profileData) {
      if (profileData?.profile?.photo) {
        setAvatar(
          <img
            src={profileData?.profile?.photo}
            style={{
              width: PROFILE_WIDTH,
              height: PROFILE_HEIGHT,
              borderRadius: PROFILE_RADIUS,
            }}
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

  const handleOpenPicker = (type: any) => {
    // Replace with web image picker logic
    // Example: using file input or third-party library
    // Use a file input to select and upload images
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
        <Avatar/>
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
          style={{
            width: PROFILE_WIDTH,
            height: PROFILE_HEIGHT,
            borderRadius: PROFILE_RADIUS,
          }}
          alt="Updated Profile"
        />
      );
    } catch (error) {
      console.error('Error updating profile pic:', error);
    }
  };

  return (
    <div style={styles.ellipseParent}>
      <button
        onClick={() => setShowModal(true)}
        style={styles.avatarButton}
      >
        {avatar}
      </button>

      <div style={styles.groupWrapper}>
        <div style={styles.frameWrapperLayout}>
          <div style={styles.brisbaneAustraliaParent}>
            <p >
              {profileData?.email}
            </p>
            <p >
              {profileData?.name}
            </p>
          </div>
        </div>
      </div>
      <div style={styles.rankingParent}>
        <p >RANKING</p>
        <div >
          <p>
            {profileData?.reviews?.totalAverageCount > 0
              ? profileData?.reviews?.totalAverageCount
              : null}
          </p>
          {Array.from({ length: profileData?.reviews?.totalAverageCount }).map(
            (_, index) => (
              <Icon key={index} color="#ffd700" />
            )
          )}
        </div>
        <div style={styles.button}>
          <div style={styles.buttonbase}>
            <div style={styles.buttonFlexBox}>
              <img
                src="../assets/images/buttonicon.png"
                style={styles.buttonicon}
                alt="Button Icon"
              />
              <button
                onClick={() => navigate('/message-screen')}
              >
                <p >Message</p>
              </button>
            </div>
          </div>
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

const styles = {
  // Define your styles here
  ellipseParent: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarButton: {
    border: 'none',
    background: 'transparent',
  },
  groupWrapper: {
    height: 65,
  },
  frameWrapperLayout: {
    width: 309,
    height: 65,
  },
  brisbaneAustraliaParent: {
    marginTop: -32.5,
    marginLeft: -154.5,
    top: '50%',
    paddingHorizontal: 0,
    paddingVertical: 3,
    width: 309,
    height: 65,
    display: 'flex',
    alignItems: 'center',
  },
  brisbaneAustralia: {
    textAlign: 'center',
    color: '#6C6C6C',
    fontSize: 14,
  },
  constructionForeman: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8E',
    marginTop: 2,
    textAlign: 'center',
  },
  rankingParent: {
    width: 160,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 60,
  },
  ranking: {
    textAlign: 'center',
    color: '#6C6C6C',
    fontSize: 14,
  },
  starsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: -80,
    marginTop: 56,
  },
  buttonbase: {
    borderRadius: 9,
    backgroundColor: '#F5F5F5',
  },
  buttonFlexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonicon: {
    marginRight: 8,
  },
  message: {
    fontSize: 16,
    color: '#4A90E2',
  },
  modal: {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      maxWidth: '500px',
      margin: 'auto',
      padding: '20px',
      borderRadius: '10px',
    },
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default ProfileAdminViewSection;
