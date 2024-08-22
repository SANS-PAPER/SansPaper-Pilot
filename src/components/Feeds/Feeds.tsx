"use client";

import { Avatar } from 'antd';
//import './style.css'; 
import Breadcrumb from '../Breadcrumbs/Breadcrumb';

const Feeds = () => {
  

  return (
    <div className="container">
        <Breadcrumb pageName="Feeds" />

        <div className="flex space-x-4 bg-white pl-10 pt-10 pb-10 " >
            <div className="flex-[0.9]">
                <h5 className="text-2xl font-bold text-purple-900">Construction Project Manager</h5>
                <p className="text-black font-semibold">Sans Paper Group</p>
                <p className="text-black">We are seeking an experinced and highly motivated Construction Project Manager to join our dynamic team. 
                    The ideal candidate will have a proven track record in successfully managing construction projects from inception to completion.
                    As a Construction Project Manager, you will be responsible for overseeing all aspects of the construction process, ensuring adherence
                    to project timelines, budgets, and quality.
                </p>
                <div className="flex pt-5 pb-1">
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">Work Type 1</button>
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md">2-3 yrs exp</button>
                </div>
                <p className="text-gray-600 text-xs">Posted on 17-08-2024 1:14 PM</p>
                <div className="flex items-center">
                    <Avatar size={40} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    <p className="text-purple-900 font-semibold">Khairunnisa Kahliep - Mobile Developer</p>
                </div>
            </div>
            <div className="flex-[0.1]">
            <p>$80.00/hr</p>
            <button className="bg-gray text-black px-4 py-2 rounded-md">Apply</button>
            </div>
        </div>

        <div className="flex space-x-4 bg-white pl-10 pt-10 pb-10" >
            <div className="flex-[0.9]">
                <h5 className="text-2xl font-bold text-purple-900">Construction Project Manager</h5>
                <p className="text-black font-semibold">Sans Paper Group</p>
                <p className="text-black">We are seeking an experinced and highly motivated Construction Project Manager to join our dynamic team. 
                    The ideal candidate will have a proven track record in successfully managing construction projects from inception to completion.
                    As a Construction Project Manager, you will be responsible for overseeing all aspects of the construction process, ensuring adherence
                    to project timelines, budgets, and quality.
                </p>
                <div className="flex pt-5 pb-1">
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md mr-2">Work Type 1</button>
                <button className="bg-purple-900 text-white px-4 py-2 rounded-md">2-3 yrs exp</button>
                </div>
                <p className="text-gray-600 text-xs">Posted on 17-08-2024 1:14 PM</p>
                <div className="flex items-center">
                    <Avatar size={40} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                    <p className="text-purple-900 font-semibold">Khairunnisa Kahliep - Mobile Developer</p>
                </div>
            </div>
            <div className="flex-[0.1]">
            <p>$80.00/hr</p>
            <button className="bg-gray text-black px-4 py-2 rounded-md">Apply</button>
            </div>
        </div>
    
    </div>
  );
};

export default Feeds;