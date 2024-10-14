"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useUserStore } from "@/store/user/userStore";
import {useUserData} from "@/graphql/useUserData";
//import { PhotoData } from "./types/PhotoData";
import { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { Button, Divider, Form, Input, Modal, Select, Spin, Switch } from 'antd';
import { client } from "@/app/api/client";
import { useUpdatePreferencesMutation, useUpdateProfileMutation, useUpdateSummaryMutation } from "@/gql/_generated";
import { UpdateAvailableInput } from "./types/updatePreferences";
import { showSuccessNotification, showErrorNotification } from "@/components/Notification/NotificationUtil";
import usePhotoData from "@/graphql/usePhotoData";
import useUserSkill from "@/graphql/useUserSkill";
import { UpdateSummaryVariables } from "./types/updateSummary";
import Lightbox from 'react-image-lightbox';
import ImageModal from "./ImageModal";
import './Gallery.css';
import useCompletedForm from '@/graphql/getCompletedTrainingForm';
import AWS from 'aws-sdk';
import useReviewData from "@/graphql/getReviews";

interface GalleryItem {
  answer: string;
  fieldId: string;
  componentId: string;
  fillupFormFields: string;
}

type UploadResponseType = {
  Location: string;
  ETag: string;
  Bucket: string;
  Key: string;
} | null;

interface ReviewItemProps {
  title: string;
  stars: number;
  reviewerPhoto: string;
}

const Profile: FC = () => {

  const { userId, userAuth } = useUserStore();
  const { Option } = Select;

  const { dataUser, errorUser, isLoadingUser } = useUserData(userId || "");
  const { dataPhoto, errorPhoto, isLoadingPhoto } = usePhotoData(userId || "");
  const {dataSkill, errorSkill, isLoadingSkill} = useUserSkill(userId || "");
  const {dataCompleted, errorCompleted, isLoadingCompleted} =
      useCompletedForm(userId || "");
  const {dataReview, errorReview, isLoadingReview} = useReviewData(userId || "");

  const { mutateAsync: updatePreferences } = useUpdatePreferencesMutation(client);
  const { mutateAsync: updateUserSummary } = useUpdateSummaryMutation(client);

  const [photoIndex, setPhotoIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGallery, setIsEditingGallery] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [bio, setBio] = useState('');
  const [isAvailableToWork, setIsAvailableToWork] = useState(false);
  const [preferredLocation, setPreferredLocation] = useState('');
  const [form] = Form.useForm();
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([]);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [newSkills, setNewSkills] = useState(dataSkill || []);
  const [trainingFormCount, setTrainingFormCount] = useState<number>(0);
  const [completedFormCount, setCompletedFormCount] = useState<number>(0);
  const [imageUri, setImageUri] = useState(null);
  const [uploadResponse, setUploadResponse] = useState<UploadResponseType>(null);
  const [avatar, setAvatar] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const workTypeLabels: { [key: string]: string } = {
    '1': 'Full-time',
    '2': 'Part-time',
    '3': 'Contract',
  };  

  const handleAvailabilityChange = (checked:any) => {
    setIsAvailableToWork(checked);
    // Handle the change event here, e.g., update state or make an API call
  };

  const handleLocationChange = (event:any) => {
    setPreferredLocation(event.target.value);
  };

  const [images, setImages] = useState(galleryData.map(item => ({
    url: `${process.env.DIGITAL_OCEAN_FILE_PATH}/${item.answer.replace(/"/g, '')}`,
  })));

  const handleEdit = () => {
    setIsEditingProfile(true);
  };

  const handleSave = async () => {
    try {
      const input: UpdateSummaryVariables = {
        patch: {
          summaryBio: bio,
        },
      };

      const response = await updateUserSummary({
        patch: {
          id: userId, 
          ...input,
        },
      });
  
      showSuccessNotification('Profile bio updated successfully');
      setIsEditingProfile(false);
  
    } catch (error) {
      showErrorNotification('Failed to update profile bio');
    }
  };

  const handleImageUpload = (event:any) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImages([...images, { url: imageUrl }]);
  };

  const handleRemoveImage = (index:number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const toggleGalleryEditing = () => {
    setIsEditingGallery(!isEditingGallery);
  };

  useEffect(() => {
    if (dataUser?.[0]?.availables) {
      setIsAvailableToWork(dataUser?.[0]?.availables?.nodes?.[0]?.availableToWork || false);
      setPreferredLocation(dataUser?.[0]?.availables?.nodes?.[0]?.preferredLocation || '');
    }
  }, [dataUser]);

  const handleSubmit = async (values: any) => {
  try {
    const response = await updatePreferences({
      patch: {
        id: userId,
        patch: {
          availableToWork: values.isAvailableToWork,
          jobTypeId: values.workType, 
          preferredLocation: values.preferredLocation,
        },
      } as UpdateAvailableInput,
    });

    if (response?.updateAvailable?.available) {
      showSuccessNotification('Preferences updated successfully');
    } else {
      showErrorNotification('Failed to update preferences');
    }
  } catch (error) {
    showErrorNotification('Failed to update preferences');
  }
};

useEffect(() => {
  if (dataPhoto?.[0]?.fillupForms?.nodes) {
    const filteredAnswers = dataPhoto[0].fillupForms.nodes
      .flatMap(form => form.fillupFormFields || [])
      .filter(field => {
        const answer = field.answer || '';
        const componentId = field.field?.component?.id || '';

        const cleanAnswer = answer.replace(/^"|"$/g, '');

        const isValidAnswer =
          cleanAnswer.trim().length > 0 &&
          cleanAnswer !== '""' &&
          cleanAnswer !== 'null';

        return componentId === '125' && isValidAnswer;
      })
      .map(field => ({
        answer: field.answer || '',
        fieldId: field.field?.id || '',
        componentId: field.field?.component?.id || '',
        fillupFormFields: field.id,
      }));

    setGalleryData(filteredAnswers);
  }
}, [dataPhoto]);

    const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const updatedSkills = [...newSkills];
      updatedSkills[index].description = e.target.value;
      setNewSkills(updatedSkills);
    };
    
    const handleAddSkill = () => {
      setNewSkills([...newSkills, { description: '', expiry: '' }]);
    };
    
    const handleRemoveSkill = (index: number) => {
      const updatedSkills = newSkills.filter((_, i) => i !== index);
      setNewSkills(updatedSkills);
    };
    
    const handleAddSkillRedirect = () => {
      window.location.href = "https://form.sanspaper.com/";
    };

    const mutateProfile = useUpdateProfileMutation(client, {
      onSuccess: () => {
        window.alert('Profile Pic updated successfully');
      },
      onError: () => {
        window.alert('Error updating profile pic');
      },
    });

    const handleUpdateProfilePic = async (filename:any) => {


      if (!client) {
        window.alert('Error: GraphQL client not initialized for update photos');
        return;
      }
  
      try {
        await mutateProfile.mutate({
          patch: {
            id: userId,
            patch: {
              photo: filename,
              
            },
          },
        });
  
        setAvatar(
          <Image
            src={filename}  // Use the correct image URL or path
            width={160}
            height={160}
            alt="Profile Picture"  // Provide a meaningful alt text
          />,
        );
  
      } catch (error) {
        console.error('Error updating profile pic:', error);
      }
    };
  
    useEffect(() => {
      if (dataUser) {
        setBio(dataUser[0]?.summaryBio || '');
      }
      if (dataSkill) {
        setNewSkills(dataSkill);
      }
    }, [dataUser, dataSkill]);
  
    const uploadPhoto = async (file: File) => {
  
      const spaceName = 'sanspaperform-images';
      const region = 'us-east-1';
      const accessKeyId = `${process.env.AWS_ACCESS_KEY_ID}`;
      const secretAccessKey = `${process.env.AWS_SECRET_ACCESS}`;
      const fileNameForDB = file.name;
  
      // Configure AWS SDK
      const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
      const s3 = new AWS.S3({
        endpoint: spacesEndpoint,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        region: region,
      });

      try {
        const params = {
          Bucket: spaceName,
          Key: `staging/photo-uploads/${file.name}`,
          Body: file,
          ACL: 'public-read',
          ContentType: file.type,
        };
        const data = await s3.upload(params).promise();
        handleUpdateProfilePic(`https://sanspaperform-images.nyc3.cdn.digitaloceanspaces.com/staging/photo-uploads/${fileNameForDB}`)
        setUploadResponse(data as UploadResponseType);
      } catch (error) {
        showErrorNotification('Error uploading image: ');
      }
    };
  
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
    
    const ReviewItem: FC<ReviewItemProps> = ({title, stars, reviewerPhoto}) => {
      return (
        <div >
          <Image
            src={
              reviewerPhoto
                ? reviewerPhoto
                : 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'
            }
            alt="Reviewer"
            width={50}
            height={50}
          />
          <div >
            <p>{title}</p>
            <div >
              {Array.from({length: stars}).map((_, index) => (
                <FontAwesomeIcon key={index} icon={faStar} size="lg" color="#ffd700" />
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    useEffect(() => {
      if (dataCompleted) {
       
        const trainingFormCount = dataCompleted.filter(
          node => node.form.isSpecial !== null,
        ).length;
        const completedFormCount = dataCompleted.length;
  
        setTrainingFormCount(trainingFormCount);
        setCompletedFormCount(completedFormCount);
      }
    }, [dataCompleted]);

  return (
    <DefaultLayout>
      <div className="mx-auto ">
        <Breadcrumb pageName="Profile" />
        <div>
    </div>
      
    <div className="flex space-x-4 bg-white">
    <div className="flex-[0.3]">
        <div className="overflow-hidden rounded-md bg-white shadow-default  dark:bg-boxdark">
          <div className="relative z-20 h-35 md:h-65">
            <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            
                <input
                  type="file"
                  name="cover"
                  id="cover"
                  className="sr-only"
                />
            
            </div>
          </div>

          {/* Update profile Picture */}

          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-45 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3 overflow-hidden">
  <div className="relative w-full h-full rounded-full overflow-hidden drop-shadow-2">
  <Image
        src={avatar || '/images/logo/SansPaperID.svg'}
        width={160}
        height={160}
        alt="profile"
        className="object-cover w-full h-full"
        onClick={() => setShowModal(true)} // Show modal on image click
      />
  </div>
  <label
    htmlFor="profile"
    className="absolute bottom-0 left-30 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2 z-40"
    style={{ zIndex: 40 }} 
  >
    <svg
      className="fill-current"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
        fill=""
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
        fill=""
      />
    </svg>
    <input
      type="file"
      name="profile"
      id="profile"
      className="sr-only"
    />
  </label>
</div>
<Modal
    visible={showModal}
    onCancel={() => setShowModal(false)} // Use onCancel for closing the modal
    footer={null} // Optional, to remove default footer buttons
  >
    <div className="flex flex-row justify-center p-4">
      <p>Select Options</p>
    </div>
    <button
      onClick={() => handleOpenPicker(1)} 
    >
      <p>Open Camera</p>
    </button>
    <Divider />
    <button
      onClick={() => handleOpenPicker(2)} 
    >
      <p>Choose from Image Gallery </p>
    </button>
  </Modal>

            <div className="mt-4">
              <h3 className="align-left mb-1.5 font-semibold mb-5">
                Contact Information
              </h3>
              <div className="flex items-center mt-2 ml-2">
                <p className="text-black font-semibold mr-2">Phone :</p>
                <p className=" font-medium">{dataUser?.[0]?.phoneNumber}</p>
              </div>

              <div className="flex items-center mt-2 ml-2">
                <p className="text-black font-semibold mr-2">Address :</p>
                <p className=" font-medium">{dataUser?.[0]?.profile?.address}</p>
              </div>
              <div className="flex items-center mt-2 ml-2">
                <p className="text-black font-semibold mr-2">Email :</p>
                <p className=" font-medium">{dataUser?.[0]?.email}</p>
              </div>

              {/* Preferences */}
              <div className="space-y-5 mt-20">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="align-center font-semibold dark:text-white">Preferences</h3>
                  {!isEditingPreferences && (
                  <button
                    className="hover:text-blue-700 mr-0"
                    onClick={() => setIsEditingPreferences(!isEditingPreferences)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </button>
                )}
                </div>
                {isEditingPreferences ? (
                <Form
                  form={form}
                  layout="vertical"
                  name="preferences"
                  initialValues={{ isAvailableToWork, preferredLocation }}
                  onFinish={handleSubmit}
                >
                  <Form.Item
                    className="flex text-black font-semibold mr-2"
                    name="isAvailableToWork"
                    label="Availability"
                  >
                    <Switch
                      checked={isAvailableToWork}
                      onChange={handleAvailabilityChange}
                    />
                  </Form.Item>
                  <Form.Item name="workType" label="Work Type">
                    <Select placeholder="Select work type">
                      {Object.entries(workTypeLabels).map(([value, label]) => (
                        <Option key={value} value={value}>
                          {label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="preferredLocation" label="Preferred Location">
                    <Input
                      value={preferredLocation}
                      onChange={handleLocationChange}
                    />
                  </Form.Item>
                  {isEditingPreferences && (
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Update Preferences
                      </Button>
                      <Button
                        type="default"
                        onClick={() => {
                          setIsEditingPreferences(false);
                          form.resetFields();
                        }}
                        style={{ marginLeft: '10px' }}
                      >
                        Cancel
                      </Button>
                    </Form.Item>
                  )}
                </Form>
              ) : (
                <div>
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-black">Availability:</p>
                    <p className="ml-2">{isAvailableToWork ? 'Available' : 'Not Available'}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-black">Work Type:</p>
                    <p className="ml-2">{dataUser?.[0]?.availables?.nodes?.[0]?.jobType?.description}</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-black">Preferred Location:</p>
                    <p className="ml-2">{dataUser?.[0]?.availables?.nodes?.[0]?.preferredLocation}</p>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
          </div>
          </div>


        <div className="flex-[0.7] mt-10" >
              <div className="text-black font-bold text-xl">
                {dataUser?.[0]?.name}
              </div>
              <p className=" font-medium">{dataUser?.[0]?.jobTitle}</p>
              <p className=" mt-2 text-black font-medium">Public Profile</p>
              <div className="mt-10 flex items-center">
                <div className="">
                <p className="mr-10">FORM SUBMITTED</p>
                <p className="text-black font-semibold">{completedFormCount}</p>
                </div>
                <div className="">
                <p className="mr-10">TRAINING COMPLETED</p>
                <p className="text-black font-semibold ">{trainingFormCount}</p>
                </div>
              </div>
              <p className="mt-5">Ranking</p>
              <div className="flex mb-10">
                <p className="mr-10">8.6</p>
                <div></div>
              </div>

              {/* Gallery section */}
              <div className="mt-10 mb-5 mr-3">
      <div className="flex items-center justify-between mb-5">
        <p className="font-bold text-lg">Gallery</p>
        <button
          onClick={toggleGalleryEditing}
          className="flex items-center px-4 py-2 text-blue rounded-md"
        >
          <FontAwesomeIcon icon={isEditingGallery ? faSave : faEdit} className="mr-2" />
          {isEditingGallery ? 'Save' : 'Edit'}
        </button>
      </div>
      {isEditingGallery && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
      )}
      <div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {(images.length > 5 ? images.slice(0, 5) : images).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.url}
                alt={`Image ${index}`}
                className="w-full h-auto object-cover cursor-pointer"
                onClick={() => {
                  setPhotoIndex(index);
                  setIsOpen(true);
                }}
              />
              {isEditingGallery && (
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              )}
            </div>
          ))}
        </div>
        {images.length > 5 && !isModalOpen && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-blue-500"
          >
            View All
          </button>
        )}
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex].url}
            nextSrc={images[(photoIndex + 1) % images.length].url}
            prevSrc={images[(photoIndex + images.length - 1) % images.length].url}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % images.length)
            }
          />
        )}
        <ImageModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          images={images}
        />
      </div>
    </div>


                {/* Profile description */}
                <div className="mt-10 mb-5 mr-3">
              <div className="flex justify-between items-center mb-5">
                <p className="font-bold text-lg">PROFILE DESCRIPTION</p>
                {!isEditingProfile && (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 text-blue rounded-md"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit
                  </button>
                )}
              </div>
              <div className="bg-gray p-4 rounded-lg relative">
                {isEditingProfile ? (
                  <div>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full h-40 p-2 border border-gray-300 rounded-md"
                    />
                    <button onClick={handleSave} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                      Save
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-black">{dataUser?.[0]?.summaryBio}</p>
                  </div>
                )}
              </div>
            </div>

                {/* Skills */}
                <div className="mt-10 mb-5 mr-3">
                  
  
  <div>
    <div className="flex justify-between items-center mb-5">
  <p className="font-bold text-lg mb-5"> TOP SKILLS</p>
        <button
          onClick={handleAddSkillRedirect}
          className="px-4 py-2 text-blue rounded-md"
        >
          <FontAwesomeIcon icon={isEditingSkills ? faSave : faEdit} className="mr-2" />
          {isEditingSkills ? 'Save' : 'Edit'}
        </button>
        </div>
        {isEditingSkills ? (
          <div>
            {newSkills.map((skill: any, index: number) => (
              <div key={index} className="flex items-center mb-4">
                <Input
                  value={skill.description}
                  onChange={(e) => handleSkillChange(e, index)}
                  className="w-full"
                />
                <Button
                  type="primary"
                  danger
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-2"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="dashed" onClick={handleAddSkill}>
              Add Skill
            </Button>
          </div>
        ) : (
  <div>
    {isLoadingSkill || !dataSkill ? (
      !isLoadingSkill && !dataSkill ? (
        <p>No skills added</p>
      ) : (
        <Spin size="large" />
      )
    ) : (
      
          <div>
            {dataSkill?.map((a: any) =>
              a.skill.map((sk: any) => (
                <div
                  className="flex items-center mb-4"
                  key={sk.description}
                >
                  <Image
                    className="w-6 h-6 mr-3"
                    src="/images/group-368691.png"
                    alt="Skill icon"
                    width={24}
                    height={24}
                  />
                  <div>
                    <p className="font-semibold">{sk.description}</p>
                    <p className="text-gray-600">{a.expiry}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    )}
  </div>

          <div className="flex justify-between items-center mb-5">
          <p className="font-bold text-lg mb-5"> REVIEWS</p>
          </div>
          <div className="profile-description-parent">
      <p className="profile-description skills-typo">
        {dataReview && dataReview.length > 0
          ? `Review (${dataReview.length})`
          : 'Review (0)'}
      </p>

      <ul className="review-list" style={{ marginTop: '10px' }}>
        {dataReview && dataReview.map((item: any) => (
          <li key={item.id}>
            <ReviewItem
              title={item.recText}
              stars={item.recValue}
              reviewerPhoto={item.recommenderProfilePic}
            />
          </li>
        ))}
      </ul>
    </div>
    </div>
        </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;