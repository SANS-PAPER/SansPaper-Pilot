"use client";

import { Avatar } from 'antd';
//import './style.css'; 
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import useJobFeedsData from '@/graphql/getJobFeedList';
import moment from 'moment';

const Feeds = () => {

    const {dataJobFeeds, errorJobFeeds, isLoadingJobFeeds} = useJobFeedsData();

    const getParsedDate = (date: string | undefined): string => {
        if (date) {
            const parsedDate = moment(date, moment.ISO_8601, true);
            const formattedDate = parsedDate.format('DD-MM-YYYY [at] h:mm A');
    
            return `Posted ${parsedDate.isValid() ? formattedDate : 'Invalid Date'}`;
        }
        
        return 'Unknown Date';
    };

    if (isLoadingJobFeeds) return <p>Loading...</p>;
    if (errorJobFeeds) return <p>Error loading job feeds</p>;
  
  return (
    <div className="container">
        <Breadcrumb pageName="Feeds" />

        {dataJobFeeds?.map((jobFeed, index) => (
        <div key={index} className="flex space-x-4 bg-white pl-10 pt-10 pb-10">
          <div className="flex-[0.9]">
            <h5 className="text-2xl font-bold text-purple-900">{jobFeed?.jobTitle}</h5>
            <p className="text-black font-semibold">{jobFeed?.user?.organizationUsers?.nodes?.[0]?.organization?.name}</p>
            <p className="text-black">{jobFeed?.jobDescription}</p>
            <div className="flex pt-5 pb-1">
            {jobFeed?.workTypes && jobFeed.workTypes.length > 0 ? (
                  // If workTypes is an array and not empty, map over it
                  jobFeed.workTypes.map((workType, idx) => (
                    <button key={idx} className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">
                      {workType.name}
                    </button>
                  ))
                ) : (
                  <button className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">
                    Unknown Work Type
                  </button>
                )}
              <button className="bg-purple-900 text-white px-4 py-2 rounded-md">{jobFeed?.expRange} yrs exp</button>
            </div>
            <p className="text-gray-600 text-xs">{getParsedDate(jobFeed?.updatedAt)}</p>
            <div className="flex items-center">
              <Avatar size={40} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              <p className="text-purple-900 font-semibold">{jobFeed?.user?.name} - {jobFeed?.user?.jobTitle}</p>
            </div>
          </div>
          <div className="flex-[0.1]">
            <p>${jobFeed?.amount}/{jobFeed?.payPeriods?.[0]?.shortName}</p>
            <button className="bg-gray text-black px-4 py-2 rounded-md">View</button>
          </div>
        </div>
      ))}
    
    </div>
  );
};

export default Feeds;