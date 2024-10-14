"use client";

import { Avatar } from 'antd';
import './style.css'; 
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import {  FaMapMarked } from 'react-icons/fa';
import useGetUserList from '@/graphql/getUserList';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FillupFormNode, ReviewNode, UserNode } from './types/getUserList';
import FormLoader from '../FormLoader';
import StarIcon from '@mui/icons-material/Star';
import Link from 'next/link';

const Jobs = () => {
  const {dataUserList, errorUserList, isLoadingUserList} = useGetUserList();
  const [userID, setUserID] = useState<string | null>(null);

  const [structuredData, setStructuredData] = useState<UserNode[]>([]);


  useEffect(() => {
    if (dataUserList) {
      reconstructDataForTrainingForm(dataUserList);
    }
  }, [dataUserList]);

  useEffect(() => {
    const fetchUserID = async () => {
      const storedUserID = await localStorage.getItem('userID');
      if (storedUserID) {
        setUserID(storedUserID);
      }
    };

    fetchUserID();
  }, []);

  const reconstructDataForTrainingForm = (data: UserNode[] | undefined) => {
    if (!data) return;
  
    const updatedData = data.map((user) => {
      const totalCountTraining = user.fillupForms?.nodes.filter(
        (form) => form.form?.isSpecial !== null
      ).length || 0;
  
      const totalRecValue = user.reviews?.nodes.reduce(
        (acc, review) => acc + Number(review.recValue),
        0
      ) || 0;
      const totalCount = user.reviews?.totalCount ?? 0;
      const totalAverageCount = totalCount > 0 ? totalRecValue / totalCount : 0;
  
      return {
        ...user,
        fillupForms: {
          ...user.fillupForms,
          totalCountTraining,
        },
        reviews: {
          ...user.reviews,
          totalAverageCount,
        },
      } as UserNode; 
    });
  
    setStructuredData(updatedData);
  };

  const getPhotos = (photo: string | null | undefined, name: string) => {
    if (!photo) {
      return (
        <Avatar
          size={35}
          style={{ backgroundColor: '#6733b9' }}
          icon={<UserOutlined />}
        />
      );
    } else {
      return <Avatar size={35} src={photo} alt={name} />;
    }
  };

  const handleNavigation = () => {
    <Link href="/profile-admin-view">
    
    </Link>
  };

//   return (
//     <div className="container">
//         <Breadcrumb pageName="Jobs" />

//         {dataUserList?.map((userList: UserNode, index) => (
//         <div className="flex space-x-4 bg-white pl-10 pt-10 pb-10 " >
//           <div className="flex">
//           {getPhotos(userList?.profile?.photo)}
//           </div>
//             <div className="flex-[0.8]">
//                 <h5 className="text-2xl font-bold text-purple-900">{userList?.name} - {userList?.jobTitle}</h5>
//                 <div className="flex items-center">
//                 <FaMapMarked className="text-gray-900 text-small mr-2" /> {userList?.profile?.city}, {userList?.profile?.country}
//                 </div>
//                 <div className="vertical-line flex ">
//                 <p className=" job-description text-black ">{userList?.summaryBio || 'null'}
//                 </p>
//                 </div>
//                 <div className="flex pt-5 pb-1">
//                 <button className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">{userList?.fillupForms?.totalCount} Forms Completed</button>
//                 <button className="bg-purple-900 text-white px-4 py-2 rounded-md">{userList?.fillupForms?.totalCountTraining} Training Completed</button>
//                 </div>
                
//             </div>
//             <div className="flex-[0.1]">
//             <button className="bg-gray text-black px-4 py-2 rounded-md">Apply</button>
//             </div>
//         </div>

//         ))}
     
//     </div>
//   );
// };

const renderItem = (item: UserNode) => (
  <Link
  href={{
    pathname: "/profile-admin-view",
    query: {
      userID: userID,
      receiverID: item.id,
      profileData: JSON.stringify(item), // profileData is passed as a JSON string
    },
  }}
  className="mobileswipeactions"
>
    <div className="flex space-x-4 bg-white pl-10 pt-10 pb-10 " >
          <div className="flex">
            {getPhotos(item?.profile?.photo, item?.name)}
          </div>
          <div className="flex-[0.8]">
          <h5 className="text-2xl font-bold text-purple-900">{item?.name} - {item?.jobTitle}</h5>
          <div className="flex items-center text-gray-700">
                <FaMapMarked className=" text-small mr-2" /> {item?.profile?.city}, {item?.profile?.country}
               </div>
               <div >
          <div >
            {/* <div className="frameChild" /> */}
            <p className="text-black">
              {`${item?.summaryBio}`}
            </p>
          </div>
        </div>

        {/* REVIEW */}
        <div>
          <span className="text-black">
            {item?.reviews?.totalAverageCount ?? 0 > 0
              ? item?.reviews?.totalAverageCount
              : null}
          </span>
          {Array.from({ length: Math.round(item?.reviews?.totalAverageCount || 0) }).map(
            (_, index) => (
              <StarIcon key={index} style={{ color: '#ffd700' }} />
            )
          )}
        </div>

                <div className="flex pt-5 pb-1">
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">{item?.fillupForms?.totalCount} Forms Completed</button>
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md">{item?.fillupForms?.totalCountTraining} Training Completed</button>
                </div>
             
          </div>
          <div className="flex-[0.1]">
          <button className="bg-gray text-black px-4 py-2 rounded-md">Apply</button>
            </div>
            <div className="divider" />
    
    </div>
  </Link>
);

return (
  <div >
    {structuredData.length > 0 ? (
      structuredData.map((item) => renderItem(item))
    ) : (
      <FormLoader />
    )}
  </div>
);
};

export default Jobs;
