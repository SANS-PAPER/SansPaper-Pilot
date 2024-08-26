"use client";

import { Avatar } from 'antd';
//import './style.css'; 
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import {  FaMapMarked } from 'react-icons/fa';
import useGetUserList from '@/graphql/getUserList';
import { UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { FillupFormNode, ReviewNode, UserNode } from './types/getUserList';
import SearchWorkersScreen from './SearchWorkersScreen';

const Search = () => {

  const {dataUserList, errorUserList, isLoadingUserList} = useGetUserList();

  const [structuredData, setStructuredData] = useState<UserNode[] | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');


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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleSortByRank = (sortType:any) => {
    setSortQuery(sortType);
  };
  
  return (
    <div className="container">
    {/* Search Input */}
    <div style={{ marginBottom: '16px' }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </div>

    {/* Sort Buttons in a Horizontal Scrollable Div */}
    <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '8px' }}>
      <button
        className={`sort-button ${sortQuery === 'HighestRank' ? 'selected' : ''}`}
        onClick={() => toggleSortByRank('HighestRank')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: sortQuery === 'HighestRank' ? '#6733b9' : 'white',
          color: sortQuery === 'HighestRank' ? 'white' : 'black',
        }}
      >
        Highest Rank
      </button>
      <button
        className={`sort-button ${sortQuery === 'LowestRank' ? 'selected' : ''}`}
        onClick={() => toggleSortByRank('LowestRank')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: sortQuery === 'LowestRank' ? '#6733b9' : 'white',
          color: sortQuery === 'LowestRank' ? 'white' : 'black',
        }}
      >
        Lowest Rank
      </button>
      <button
        className={`sort-button ${sortQuery === 'HighestCompletedForm' ? 'selected' : ''}`}
        onClick={() => toggleSortByRank('HighestCompletedForm')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: sortQuery === 'HighestCompletedForm' ? '#6733b9' : 'white',
          color: sortQuery === 'HighestCompletedForm' ? 'white' : 'black',
        }}
      >
        Highest Completed Form
      </button>
      <button
        className={`sort-button ${sortQuery === 'LowestCompletedForm' ? 'selected' : ''}`}
        onClick={() => toggleSortByRank('LowestCompletedForm')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: sortQuery === 'LowestCompletedForm' ? '#6733b9' : 'white',
          color: sortQuery === 'LowestCompletedForm' ? 'white' : 'black',
        }}
      >
        Lowest Completed Form
      </button>
      <button
        className={`sort-button ${sortQuery === 'HighestTrainingForm' ? 'selected' : ''}`}
        onClick={() => toggleSortByRank('HighestTrainingForm')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: sortQuery === 'HighestTrainingForm' ? '#6733b9' : 'white',
          color: sortQuery === 'HighestTrainingForm' ? 'white' : 'black',
        }}
      >
        Highest Training Form
      </button>
      <button
        className={`sort-button ${sortQuery === 'LowestTrainingForm' ? 'selected' : ''}`}
        onClick={() => toggleSortByRank('LowestTrainingForm')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: sortQuery === 'LowestTrainingForm' ? '#6733b9' : 'white',
          color: sortQuery === 'LowestTrainingForm' ? 'white' : 'black',
        }}
      >
        Lowest Training Form
      </button>
      <button
        className={`sort-button ${sortQuery === 'Clear' ? 'selected' : ''}`}
        onClick={() => toggleSortByRank('Clear')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: sortQuery === 'Clear' ? '#6733b9' : 'white',
          color: sortQuery === 'Clear' ? 'white' : 'black',
        }}
      >
        Clear
      </button>
    </div>

    {/* Passing search query to WorkersScreen */}
    <SearchWorkersScreen
      searchQuery={searchQuery}
      sortCategory={sortQuery}
    />
    </div>
  );
};

export default Search;
