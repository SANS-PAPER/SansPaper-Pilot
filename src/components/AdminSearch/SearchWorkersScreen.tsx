"use client";

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, List, Button, Spin, Rate } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useGetUserList from '@/graphql/getUserList';
import FormLoader from '@/components/FormLoader';
//import './SearchWorkersScreen.css'; 
import { UserNode } from './types/getUserList';
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SearchWorkersScreenProps {
  searchQuery: string;
  sortCategory: string;
}

const SearchWorkersScreen: React.FC<SearchWorkersScreenProps> = ({ searchQuery, sortCategory }) => {
const pathname = usePathname();
  
  const { dataUserList, isLoadingUserList, errorUserList } = useGetUserList();
  const [structuredData, setStructuredData] = useState<UserNode[]>([]);
  const [filteredData, setFilteredData] = useState<UserNode[]>([]);
  

  useEffect(() => {
    if (dataUserList) {
      reconstructDataForTrainingForm(dataUserList);
    }
  }, [dataUserList]);

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
  
  
  useEffect(() => {
    if (searchQuery) {
      filterDataBySearchQuery(searchQuery);
    } else {
      setFilteredData(structuredData);
    }
  }, [searchQuery, structuredData]);

  useEffect(() => {
    if (sortCategory) {
      sortDataByCategory(sortCategory);
    } else {
      setFilteredData(structuredData);
    }
  }, [sortCategory, structuredData]);

  const filterDataBySearchQuery = (query:any) => {
    const filtered = structuredData.filter((item) =>
      item?.name?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const sortDataByCategory = (category:any) => {
    let sortedUsers = [...structuredData];

    switch (category) {
      case 'HighestRank':
        sortedUsers.sort((a, b) => (b.reviews?.totalAverageCount ?? 0) - (a.reviews?.totalAverageCount ?? 0));
        break;
      case 'LowestRank':
        sortedUsers.sort((a, b) => (a.reviews?.totalAverageCount || 0) - (b.reviews?.totalAverageCount || 0));
        break;
      case 'HighestCompletedForm':
        sortedUsers.sort((a, b) => (b.fillupForms?.totalCount ?? 0) - (a.fillupForms?.totalCount ?? 0));
        break;
      case 'LowestCompletedForm':
        sortedUsers.sort((a, b) => (a.fillupForms?.totalCount ?? 0) - (b.fillupForms?.totalCount ?? 0));
        break;
      case 'HighestTrainingForm':
        sortedUsers.sort((a, b) => (b.fillupForms?.totalCountTraining || 0) - (a.fillupForms?.totalCountTraining || 0));
        break;
      case 'LowestTrainingForm':
        sortedUsers.sort((a, b) => (a.fillupForms?.totalCountTraining || 0) - (b.fillupForms?.totalCountTraining || 0));
        break;
      case 'Clear':
        sortedUsers;
        break;
      default:
        break;
    }

    setFilteredData(sortedUsers);
  };

  const getPhotos = (photo:any) => {
    return photo ? (
      <Avatar src={photo} size={35} />
    ) : (
      <Avatar size={35} icon={<UserOutlined />} />
    );
  };

  const renderItem = (item:UserNode) => (
    <List.Item>
   
    <Link
              // to={{
              //   pathname: `/profile/${item.id}`,
              //   state: {
              //     userID: item.id,
              //     profileData: item,
              //   },
              // }}
              className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes(`/profile/${item.id}`) && "bg-graydark dark:bg-meta-4"}`}
              style={{ display: 'flex', width: '100%' }} 
              href={`/profile/${item.id}`}      >
      <List.Item.Meta
        avatar={getPhotos(item?.profile?.photo)}
        title={`${item?.name} - ${item?.jobTitle}`}
        description={<div>{item?.summaryBio}</div>}
      />
      <div>
        <Rate disabled defaultValue={item?.reviews?.totalAverageCount} />
        <p className="text=black">{item?.fillupForms?.totalCount} Forms Completed</p>
        <p>{item?.fillupForms?.totalCountTraining} Training Completed</p>
      </div>
    </Link>
  </List.Item>
  );

  return (
    <div >
      {isLoadingUserList ? (
        <Spin />
      ) : filteredData?.length > 0 ? (
        <List
          dataSource={filteredData}
          renderItem={renderItem}
          rowKey="id"
        />
      ) : (
        <FormLoader />
      )}
    </div>
  );
};

export default SearchWorkersScreen;