import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Text,
} from '@chakra-ui/react';

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
          {InitialIcon('SP')}
        </div>

        <div style={{ paddingLeft: '5px' }}>Sans Paper Group Organization</div>
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
          <li>
            <Link
              className="flex gap-4.5 align-center border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              href="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
              {InitialIcon('SP')}
              </div>

              <div style={{ alignSelf: 'center' }}>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Sans Paper Group
                </h6>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4.5 align-center border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              href="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                {InitialIcon('MW')}
              </div>

              <div style={{ alignSelf: 'center' }}>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  MD Wind
                </h6>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4.5 align-center border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              href="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                {InitialIcon('PL')}
              </div>

              <div style={{ alignSelf: 'center' }}>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Platformers
                </h6>
              </div>
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-4.5 align-center border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              href="/messages"
            >
              <div className="h-12.5 w-12.5 rounded-full">
                {InitialIcon('GI')}
              </div>

              <div style={{ alignSelf: 'center' }}>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Go Industries
                </h6>
              </div>
            </Link>
          </li>
          {/* <li>
            <Link
              className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4"
              href="/messages"
            >

              <div>
                <h6 className="text-sm font-medium text-black dark:text-white">
                  Default
                </h6>
              </div>
            </Link>
          </li> */}
        </ul>
      </div>
      {/* <!-- Dropdown End --> */}
    </li>
  );
};

export default DropdownMessage;
