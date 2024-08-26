"use client";

import { Avatar } from 'antd';
import './style.css'; 
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import {  FaMapMarked } from 'react-icons/fa';
import useGetUserList from '@/graphql/getUserList';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FillupFormNode, ReviewNode, UserNode } from './types/getUserList';

const Jobs = () => {

  const {dataUserList, errorUserList, isLoadingUserList} = useGetUserList();

  const [structuredData, setStructuredData] = useState<UserNode[] | undefined>(undefined);


  useEffect(() => {

    if (dataUserList) {
      reconstructDataForTrainingForm(dataUserList);
    }
  }, [dataUserList]);

  const reconstructDataForTrainingForm = (data: UserNode[]) => {
    const updatedData = data.map((user: any) => {
      const fillupFormsNodes = user.fillupForms?.nodes || [];
      const reviewNodes = user.reviews?.nodes || [];
  
      const totalCountTraining = fillupFormsNodes.filter(
        (form: FillupFormNode) => form.form?.isSpecial !== null
      ).length;
  
      // Calculate totalAverageCount for reviews
      const totalRecValue = reviewNodes.reduce(
        (acc:any, review: ReviewNode) => acc + Number(review.recValue),
        0
      );
      
      const totalCount = user.reviews?.totalCount ?? 0; // Default to 0 if undefined
      const totalAverageCount = totalCount > 0 ? totalRecValue / totalCount : 0;
  
      return {
        ...user,
        fillupForms: {
          ...user.fillupForms,
          nodes: fillupFormsNodes, // Ensure this is always an array
          totalCountTraining, // Add this new field to fillupForms
        },
        reviews: {
          ...user.reviews,
          nodes: reviewNodes, // Ensure this is always an array
          totalAverageCount, // Add this new field to reviews
          totalCount, // Ensure totalCount is always a number
        },
      };
    });
  
    setStructuredData(updatedData);
  };

  const getPhotos = (photo: string | null | undefined) => {
    if (!photo) {
      return (
        <Avatar
          size={35}
          style={{ backgroundColor: '#6733b9' }}
          icon={<UserOutlined />}
        />
      );
    } else {
      return <Avatar size={35} src={photo} />;
    }
  };
  
  return (
    <div className="container">
        <Breadcrumb pageName="Jobs" />

        {dataUserList?.map((userList, index) => (
        <div className="flex space-x-4 bg-white pl-10 pt-10 pb-10 " >
          <div className="flex">
          {getPhotos(userList?.profile?.photo)}
          </div>
            <div className="flex-[0.8]">
                <h5 className="text-2xl font-bold text-purple-900">{userList?.name} - {userList?.jobTitle}</h5>
                <div className="flex items-center">
                <FaMapMarked className="text-gray-900 text-small mr-2" /> {userList?.profile?.city}, {userList?.profile?.country}
                </div>
                <div className="vertical-line flex ">
                <p className=" job-description text-black ">{userList?.summaryBio || 'null'}
                </p>
                </div>
                <div className="flex pt-5 pb-1">
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">{userList?.fillupForms?.totalCount} Forms Completed</button>
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md">{userList.fillupForms?.totalCountTraining || 0} Training Completed</button>
                </div>
                
            </div>
            <div className="flex-[0.1]">
            <button className="bg-gray text-black px-4 py-2 rounded-md">Apply</button>
            </div>
        </div>

        ))}
     
    </div>
  );
};

export default Jobs;
