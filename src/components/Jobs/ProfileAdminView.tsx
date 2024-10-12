"use client";

import React, { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom'; // React Router for web navigation
//import ConstructionForemanContainer from '../../../components/ConstructionForemanContainer';
//import DisplayTop3Photos from '../../../components/DisplayTop3Photos';
import ProfileAdminViewSection from '@/components/ProfileAdminViewSection';
//import { Color, Padding, FontFamily, FontSize } from '../../../GlobalStyles';
import usePhotoData from '@/graphql/usePhotoData';
import useReviewData from '@/graphql/getReviews';
import useUserSkill from '@/graphql/useUserSkill';
import Icon from 'react-icons/md'; // Use react-icons for web
import { useUserStore } from '@/store/user/userStore';
import { FaStar } from 'react-icons/fa';
import { UserNode } from './types/getUserList';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Spin } from 'antd';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
//import styles from 'styles'; // Assuming this is now converted to a CSS file

// Define the component
interface ProfileAdminViewProps {
  userID: string;
  receiverID: string;
  profileData: UserNode; // Assuming profileData is a JSON string
}

const ProfileAdminView= () => {
  const searchParams = useSearchParams();  // Using next/navigation
  const [userID, setUserID] = useState<string | null>(null);
  const [receiverID, setReceiverID] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserNode | null>(null);
  const { dataSkill, errorSkill, isLoadingSkill } = useUserSkill(userID || '');
  const { dataPhoto, errorPhoto, isLoadingPhoto } = usePhotoData(userID || '');
  const { dataReview, errorReview, isLoadingReview } = useReviewData(userID || '');
  const [galleryData, setGalleryData] = useState<{ answer: string; fieldId: string; componentId: string; fillupFormFields: string; }[]>([]);

  const isLoading = isLoadingSkill && isLoadingReview && isLoadingPhoto;

  useEffect(() => {
    //const userID = searchParams.get("userID") || '';
    const receiverID = searchParams.get("receiverID");
    const profileDataString = searchParams.get("profileData");

    if (userID && receiverID && profileDataString) {
      //setUserID(userID);
      setReceiverID(receiverID);

      try {
        const parsedProfileData = JSON.parse(profileDataString);
        setProfileData(parsedProfileData);
      } catch (error) {
        console.error("Error parsing profileData:", error);
      }
    }
  }, [searchParams]);


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

  if (errorSkill) {
    console.error('Error skill', errorSkill);
  }
  if (errorPhoto) {
    console.error('Error dari photos', errorPhoto);
  }
  if (errorReview) {
    console.error('Error dari review', errorReview);
  }

  const ReviewItem = ({ title, stars, reviewerPhoto }: { title: string, stars: number, reviewerPhoto: string }) => (
    <div style={stylesReview.reviewItem}>
      <img
        src={reviewerPhoto || 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png'}
        alt="Reviewer"
        style={stylesReview.reviewerPhoto}
      />
      <div >
        <span style={stylesReview.reviewTitle}>{title}</span>
        <div style={stylesReview.reviewStars}>
          {Array.from({ length: stars }).map((_, index) => (
            <FaStar key={index} name="star" size={20} color="#ffd700" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
    <Breadcrumb pageName="Profile" />
      {isLoading ? (
        <div>
          <div className="spinner"></div> {/* Use a CSS spinner or similar loading indicator */}
        </div>
      ) : (
        <div >
          <div >
          <ProfileAdminViewSection/>

            <div>
              <div className="flex flex-col items-center justify-center text-center">
              {/* Profile stats and details */}
              <div className="flex pt-5 pb-1">
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">{profileData?.fillupForms?.totalCount} Forms Completed</button>
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md">{profileData?.fillupForms?.totalCountTraining} Training Completed</button>
              </div>

              
                <p className="font-bold text-lg">PROFILE DESCRIPTION</p>

                {profileData?.summaryBio ? (
                <p>
                  {profileData?.summaryBio}
                </p>
              ) : (
                <p>
                  {'Please edit in profile section'}
                </p>
              )}

              {/* Add similar div containers for different sections like Work Experience, Top Skills, etc. */}
              <p className="font-bold text-lg mb-5"> TOP SKILLS</p>
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
                </div>

              {galleryData && galleryData.length > 0 ? (
                // <DisplayTop3Photos galleryData={galleryData} />
                <div></div>
              ) : (
                <span>No photos available</span>
              )}
            </div>

            <div >
            <p className="font-bold text-lg mb-5"> REVIEWS</p>
              <span >
                {dataReview?.length > 0 ? `Review (${dataReview.length})` : 'Review (0)'}
              </span>
              <ul>
                {dataReview?.map((item) => (
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
      )}
    </>
  );
};

export default ProfileAdminView;

// Sample styles object for CSS-in-JS
const stylesReview = {
  reviewItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '10px',
  },
  reviewerPhoto: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '15px',
  },
  reviewContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  reviewTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  reviewStars: {
    display: 'flex',
  },
};

// Similarly define styles for `styleMainPro` or convert them to a CSS file
