import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Text,
} from '@chakra-ui/react';
import { useUserData } from "@/graphql/useUserData";
import  useGetOrganizationList  from "@/graphql/getOrganizationList";
import { useUserStore } from "@/store/user/userStore";
import _ from 'lodash';

const DropdownMessage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const { userId, userAuth } = useUserStore();
  const { dataUser, errorUser, isLoadingUser } = useUserData(userId || "");
  const { dataOrganizationList, errorOrganizationList, isLoadingOrganizationList } = useGetOrganizationList(true);
  const [userOrg, setUserOrg] = useState<any>([]);
  

  useEffect(() => {
    if (!_.isEmpty(dataUser?.organizationUsers?.nodes) && !_.isEmpty(dataOrganizationList)) {
      let newArray = dataUser?.organizationUsers?.nodes;
      let display = 'block';
      newArray = newArray?.map(item => {
        let foundObj = dataOrganizationList?.find(obj => obj.id === item.organizationId);
        return { ...item, organization: foundObj, display: display };
      });
      setUserOrg(newArray);


      let activeOrganization = getValueFromCache('activeOrganization');
      if (!activeOrganization) {
        let id = dataUser?.organizationUsers?.nodes[0].organizationId ? dataUser?.organizationUsers?.nodes[0].organizationId : "0";
        localStorage.setItem('activeOrganization', id);
      }
    }
  }, [dataUser, dataOrganizationList]);

  //console.log(userOrg);

  const InitialIcon = ( initials: string ) => {
    return (
      <Box
        style={{
          backgroundColor: 'deepskyblue',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 30,
          width: 50,
          height: 50,
        }}>
        <Text style={{ color: 'white', fontSize: 20, textAlign: 'center', paddingTop: '11px' }}>{initials}</Text>
      </Box>
    );
  };

  const getValueFromCache = (key: string) => {
    return localStorage.getItem(key);
  }
  
  const actionOnClick = (item: any) => {
    setActiveOrganization(item.organizationId);
    localStorage.setItem('activeOrganization', item.organizationId);
    setDropdownOpen(!dropdownOpen);
    window.location.reload();
  }

  const [activeOrganization, setActiveOrganization] = useState<any>(getValueFromCache('activeOrganization'));
  const [activeOrganizationArray, setActiveOrganizationArray] = useState<any>([]);

  useEffect(() => {
    if (!_.isEmpty(dataOrganizationList) && !_.isEmpty(activeOrganization)) {
      let activeOrgArray = dataOrganizationList;
      activeOrgArray = activeOrgArray ? activeOrgArray.filter(item => item.id === activeOrganization) : null;
      //console.log(activeOrgArray);
      setActiveOrganizationArray(activeOrgArray ? activeOrgArray[0] : null);
    }
  }, [activeOrganization, dataOrganizationList]);


  return (
    <li className="relative">
        <Link
        ref={trigger}
        onClick={() => {
          setNotifying(false);
          setDropdownOpen(!dropdownOpen);
        }}
        className="relative flex h-8.5 w-80 items-center justify-center hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        href="#"
      >
        <div className="h-12.5 w-12.5 rounded-full">
          {InitialIcon(activeOrganizationArray?.name?.match(/\b\w/g).join(''))}
        </div>

        <div style={{ paddingLeft: '5px' }}>{activeOrganizationArray?.name}</div>
      </Link>
      
      

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute -right-16 mt-2.5 flex w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:right-0 sm:w-80 ${dropdownOpen === true ? "block" : "hidden"
          }`}
      >
        <div className="px-4.5 py-3">
          <h5 className="text-sm font-medium text-bodydark2">Select Active Organization</h5>
        </div>

        <ul className="flex h-auto flex-col overflow-y-auto">
          {userOrg.map((item: any, i:any) => (
              <li key={i}>
                <Link
                  className="flex gap-4.5 align-center border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
                  href="#"
                  onClick={() => {actionOnClick(item)}}
                >
                  <div className="h-12.5 w-12.5 rounded-full">
                    {InitialIcon(item.organization.name.match(/\b\w/g).join(''))}
                  </div>

                  <div style={{ alignSelf: 'center' }}>
                    <h6 className="text-sm font-medium text-black dark:text-white">
                      {item.organization.name}
                    </h6>
                  </div>
                </Link>
              </li>
          ))}
        </ul>
      </div>
      {/* <!-- Dropdown End --> */}
    </li>
  );
};

export default DropdownMessage;
