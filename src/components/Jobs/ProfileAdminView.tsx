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
//import styles from 'styles'; // Assuming this is now converted to a CSS file

const ProfileAdminView = () => {
  //const { userID } = useParams(); // Assuming React Router is used for routing
  const userID = useUserStore();
  const [profileData, setProfileData] = useState(null); // Assume profile data is fetched or passed as props
  const { dataSkill, errorSkill, isLoadingSkill } = useUserSkill(userID.toString());
  const { dataPhoto, errorPhoto, isLoadingPhoto } = usePhotoData(userID.toString());
  const { dataReview, errorReview, isLoadingReview } = useReviewData(userID.toString());
  const [galleryData, setGalleryData] = useState<{ answer: string; fieldId: string; componentId: string; fillupFormFields: string; }[]>([]);

  const isLoading = isLoadingSkill && isLoadingReview && isLoadingPhoto;

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
      {isLoading ? (
        <div>
          <div className="spinner"></div> {/* Use a CSS spinner or similar loading indicator */}
        </div>
      ) : (
        <div >
          <div >
            <ProfileAdminViewSection userID={userID.toString()} />

            <div>
              {/* Profile stats and details */}
              {/* Add similar div containers for different sections like Work Experience, Top Skills, etc. */}

              {galleryData && galleryData.length > 0 ? (
                // <DisplayTop3Photos galleryData={galleryData} />
                <div></div>
              ) : (
                <span>No photos available</span>
              )}
            </div>

            <div >
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
