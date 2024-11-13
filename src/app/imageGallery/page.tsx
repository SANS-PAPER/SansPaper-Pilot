"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useUserStore } from "@/store/user/userStore";
import { useUserData } from "@/graphql/useUserData";
import  useGetOrganizationList  from "@/graphql/getOrganizationList";
//import { PhotoData } from "./types/PhotoData";
import { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { Form, Select, Spin, Switch } from 'antd';
import { client } from "@/app/api/client";
import { useUpdatePreferencesMutation, useUpdateProfileMutation, useUpdateSummaryMutation } from "@/gql/_generated";
import { showSuccessNotification, showErrorNotification } from "@/components/Notification/NotificationUtil";
import Lightbox from 'react-image-lightbox';
import ImageModal from "./ImageModal";
import './Gallery.css';
import AWS from 'aws-sdk';
import {
  Box,
  Text,
  Divider,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Textarea,
  Img,
  Spinner,
} from '@chakra-ui/react';
import _, { set } from 'lodash';
import { Gallery } from "react-grid-gallery";
import { GetImagesResponse, ImagesNode } from '@/components/Images/types/getImages';
import { GetImagesByOrganizationDocument } from '@/gql/_generated';
import Swal from 'sweetalert2';

interface GalleryItem {
  answer: string;
  fieldId: string;
  componentId: string;
  fillupFormFields: string;
}

type UploadResponseType = {
  Location: string;
  ETag: string;
  Bucket: string;
  Key: string;
} | null;

interface ReviewItemProps {
  title: string;
  stars: number;
  reviewerPhoto: string;
}

const ImageGallery: FC = () => {

  const { userId, userAuth } = useUserStore();
  const { Option } = Select;

  const { dataUser, errorUser, isLoadingUser } = useUserData(userId || "");
  const { dataOrganizationList, errorOrganizationList, isLoadingOrganizationList } = useGetOrganizationList(true);

  const getValueFromCache = (key: string) => {
    return localStorage.getItem(key);
  }

  const [activeOrganization, setActiveOrganization] = useState<any>(getValueFromCache('activeOrganization'));

  const organizations = [
    { value: 'mdwind', name: 'MdWind', email: 'mdw_blocked@platformers.com.au', password: '7akKv$$2@CJgNK' },
    { value: 'biomix', name: 'Biomix', email: 'biomix_upvise@platformers.com.au', password: 'enmohl2cm6' },
    { value: 'elevare', name: 'Elevare', email: 'eleco@verticalmatters.com.au', password: '2hCtETFH' },
  ];

  const sortOption = [
    { value: 'ID_ASC', name: 'Ascending' },
    { value: 'ID_DESC', name: 'Descending' },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [imageId, setImageId] = useState<any>('');
  const [linkedrecid, setLinkedrecid] = useState<any>('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<any>([]);
  const [imageData, setImageData] = useState<any>([]);
  const [orgSelect, setOrgSelect] = useState<any>('');
  const [sort, setSort] = useState<any>('ID_ASC');
  const [imagesArray, setImagesArray] = useState<any>([]);
  const [formData, setFormData] = useState<any>([]);
  const [pickTag, setPickTag] = useState<any>('');
  const [notAvailable, setNotAvailable] = useState<any>(false);
  const [total, setTotal] = useState<any>('');
  const [increment, setIncrement] = useState<number>(0);
  const [batchEnd, setBatchEnd] = useState<number>(100);
  const [showImages, setShowImages] = useState<any>('');
  const [imagesTagList, setImagesTagList] = useState<any>([]);

  // Default is to show the owner view
  const [isDisplay, setIsDisplay] = useState<any>('block');
  const [isDisplayOwner, setIsDisplayOwner] = useState<any>('none');
  const [activeOrganizationArray, setActiveOrganizationArray] = useState<any>([]);

  const getImageTags = async () => {
    try {
      //var image_tags = await Helper.getTags();
      //return image_tags;
    } catch (error: any) {
      //
    }
  };

  const getOrganization = async () => {
    try {
      //var org = await Helper.getActiveUpviseOrg();
      //return org;
    } catch (error: any) {
      //
    }
  };

  const createTags = async (name: string) => {
    try {
      //var tagname = await Helper.createTags(name);
    } catch (error: any) {
      //
    } finally {
      setTags([]);
    }
  };

  const fetchImages = async (orgId: any, order_by: any, first: any, offset: any): Promise<ImagesNode[]> => {
    try {
      const response: GetImagesResponse = await client.request(GetImagesByOrganizationDocument, { orgId, order_by, first, offset });
      if (response?.images?.totalCount) {
        setTotal(response.images.totalCount);
      }
      return response?.images?.nodes || [];
    } catch (error) {
      console.log('Error fetching images list:', error);
      throw error;
    }
  };

  const getImageLists = async (start: number, sort: string) => {
    try {
      let dataImages = await fetchImages(activeOrganization, sort, 100, start);
      
      if (!_.isEmpty(dataImages)) {
        var imArray: { src: string; width: number; height: number; thumbnailCaption: any; caption: any; }[] = [];
        dataImages.forEach(function (arrayItem: any) {
          imArray.push({
              src: 'https://spf-assets-aus.syd1.digitaloceanspaces.com/'+arrayItem.image,
              width: 400,
              height: 300,
              thumbnailCaption: arrayItem.id,
              caption: arrayItem.fillupFormId
          });
          setImagesArray(imagesArray.concat(imArray));
      });
      } else {
        Swal.fire({
          title: 'Info',
          text: 'No image found for this organization',
          icon: 'info',
          confirmButtonText: 'OK'
        });
      }
    } catch (error: any) {
      //
    }
  };

  const getForm = async (org: string, linkedrecid: string) => {
    try {
      //var form = await Helper.getUpviseForm(org, linkedrecid);
      //setFormData(form);
    } catch (error: any) {
      //
    }
  };

  const copyToTags = async (filename: string, pickTag: string) => {
    var email = '';
    var password = '';
    organizations.filter((value: any) => {
      if (value.value === orgSelect) {
        email = value.email ?? '';
        password = value.password ?? '';
      }
    });

    //var form = await Helper.copyToTags(filename, pickTag, email, password);
    onClose();
    setTags([]);
  };

  const setViewImagesList = (selectedTags: string) => {
    tags.filter((value: any) => {
      if (value.tags === selectedTags) {
        setImagesTagList(value.files);
      }
    });
  };

  // const organizations = [
  //     { value: 'mdwind', name: 'MdWind', email: 'mdw_blocked@platformers.com.au', password: '7akKv$$2@CJgNK' },
  //     { value: 'biomix', name: 'Biomix', email: 'biomix_upvise@platformers.com.au', password: 'enmohl2cm6' },
  //     { value: 'elevare', name: 'Elevare', email: 'eleco@verticalmatters.com.au', password: '2hCtETFH' },
  //     { value: 'summerhill', name: 'Summerhill Services', email: 'summa_blocked@verticalmatters.com.au', password: 'fV&PThz6AjXgQB' },
  //     { value: 'alldrot', name: 'All Drot', email: 'alldr@platformers.com.au', password: 'XARwVNpP3fAPm6' },
  //     { value: 'bgb', name: 'BGB Electrical Services-UAT', email: 'nick.jones@andnetwork.com.au', password: 'Substation2020' },
  //     { value: 'billow', name: 'Billow Software', email: 'sales3@platformers.com.au', password: 'dByK7Udz2k' },
  //     { value: 'bradas', name: 'Bradas Plumbing', email: 'bradas@verticalmatters.com.au', password: 'NyqD6q6c' },
  //     { value: 'brain', name: 'Brain In a Box', email: 'john.tonkin@braininabox.com.au', password: 'isl4nds' },
  //     { value: 'cjm', name: 'CJM Civil Melbourne', email: 'cjmpl@kontrol4.com', password: 'n9mKcSa4' },
  //     { value: 'central', name: 'Central Vic Civil Pty Ltd', email: 'pipco@verticalmatters.com.au', password: 'Gk2nuNGw' },
  //     { value: 'civil', name: 'Civil ISO Demonstration', email: 'civildemo@platformers.com.au', password: 'jwf>B5{;' },
  //     { value: 'connell', name: 'Connell Civil Group Pty Ltd', email: 'conci@platformers.com.au', password: 'h5aVNzYfvAjoX6' },
  //     { value: 'denso', name: 'Denso Australia', email: 'denso@kontrol4.com', password: 'tKz67eX_KEO8' },
  //     { value: 'downerinf', name: 'Downer Infrastructure', email: 'dowen@platformers.com.au', password: 'fl3La5rcYrH9c0K' },
  //     { value: 'downerstab', name: 'Downer Stabilisation', email: 'dowst@platformers.com.au', password: 'fhKtdNONp6grhxhl' },
  //     { value: 'drop', name: 'Drop and Leave', email: 'drole@platformers.com.au', password: 'Sf?Di|i6GK+_;,]3' },
  //     { value: 'fast', name: 'Fast Scaff Pty Ltd', email: 'fassc@verticalmatters.com.au', password: 'UbJXg22u' },
  //     { value: 'g3', name: 'G3 Network Services', email: 'g3@verticalmatters.com.au', password: 'eMcPLP94' },
  //     { value: 'goldsmith', name: 'Goldsmith Civil', email: 'golciv@platformers.com.au', password: 'dTJxgrrhtfT6A2' },
  //     { value: 'ground', name: 'Ground Science Pty Ltd', email: 'grosc@kontrol4.com', password: 'd4YqEn63' },
  //     { value: 'hitech', name: 'Hitech Industrial', email: 'hitin@verticalmatters.com.au', password: 'a9f2ezXz' },
  //     { value: 'kontrol', name: 'Kontrol4 Sales', email: 'sales1@kontrol4.com', password: '7uB#y3JT' },
  //     { value: 'lance', name: 'Lance Smith Excavations', email: 'lanex@platformers.com.au', password: '2[oMpI2B*EnQ}KM_xo' },
  //     { value: 'leadsun', name: 'Leadsun', email: 'leasu@platformers.com.au', password: 'dh4bsEV{S:_zHkRF#Z' },
  //     { value: 'mgp', name: 'MGP Civil', email: 'mgpci@verticalmatters.com.au', password: 'Wm4MW4Jj' },
  //     { value: 'mcpherson', name: 'McPherson Contractors', email: 'mccon@platformers.com.au', password: '5rX0EVuwp1cXFT' },
  //     { value: 'national', name: 'National Auto Service', email: 'nase@kontrol4.com', password: 'Ezc1x0Pa' },
  //     { value: 'north', name: 'North Eastern Maintenance Alliance (NEMA)', email: 'norea@platformers.com.au', password: '7AuH6NucZ9VAhBaf' },
  //     { value: 'platformers', name: 'Platformers Australia', email: 'civilsafe@platformers.com.au', password: '5momW5WpVndAKO' },
  //     { value: 'qld', name: 'QLD Civil Engineering', email: 'qldci@kontrol4.com', password: 'aQ4q8aqn' },
  //     { value: 'raw', name: 'Raw Worx', email: 'rawwo@platformers.com.au', password: '6UwudD5A9uY;SoaZ' },
  //     { value: 'savy', name: 'SAVY Civil', email: 'savci@platformers.com.au', password: '.pc(P60_x2.JQi' },
  //     { value: 'skilltech', name: 'Skilltech', email: 'skilltech@upvise.com', password: '0aHAFnH1zbtcWrRLq' },
  //     { value: 'stegg', name: 'Stegg Civil', email: 'steg@kontrol4.com', password: '3Z5KpqzH' },
  //     { value: 'sure', name: 'Sure Constructions', email: 'sure@platformers.com.au', password: 'l[Yi*2{v2)y9OU' },
  //     { value: 'sydneyciv', name: 'Sydney Civil', email: 'sydci@verticalmatters.com.au', password: '0YhjwceczXOKfBMmM' },
  //     { value: 'sydneyshade', name: 'Sydney Shade Sails', email: 'sydsh@verticalmatters.com.au', password: 'UJ8q7jKQBqbtGeF' },
  //     { value: 'thd', name: 'THD Civil Damien Saunders ', email: 'thdci@platformers.com.au', password: '1Rk7FwNBgi5N2HUySF' },
  //     { value: 'tolsaf', name: 'Tolsaf Cranes', email: 'tolcr@verticalmatters.com.au', password: 'WF8Xhqy2' },
  //     { value: 'underground', name: 'Underground Power Services', email: 'undpo@platformers.com.au', password: 'QDnV5pqa' },
  //     { value: 'united', name: 'United States Sugar', email: 'ussc@platformers.com.au', password: 'Ussc@p1at' },
  //     { value: 'universal', name: 'Universal Civil Contracting', email: 'unici@platformers.com.au', password: '96fX/mm07$vjp.b' },
  //     { value: 'vantage', name: 'Vantage Southeast', email: 'agt@platformers.com.au', password: '7nWQhx7LtQftAztP1' },
  //     { value: 'victorian', name: 'Victorian Infrastructure Services Pty Ltd', email: 'vicinfra@platformersgroup.com', password: 'r5eaFjt2iQpXCu' },
  //     { value: 'westralian', name: 'Westralian Diamond Drillers', email: 'wesdi@kontrol4.com', password: '5RHWt#4p' },
  //     { value: 'westrock', name: 'Westrock Pty Ltd', email: 'wesro@kontrol4.com.au', password: '88zSuQcX' },
  //     { value: 'williams', name: 'Williams and Burns Contracting Pty Ltd', email: 'wilbu@verticalmatters.com.au', password: 'wHjU73Mz' },
  //     { value: 'woodeson', name: 'Woodeson Excavations', email: 'wooex@platformers.com.au', password: 'rb7r9Pg7DYnCuhFxo' },
  // ];

  useEffect(() => {
    if (!_.isEmpty(dataOrganizationList)) {
        let actOrg = getValueFromCache('activeOrganization');
        let foundObj = dataOrganizationList?.find(obj => obj.id === actOrg);
        if (foundObj && String(userId) !== foundObj.adminId) {
          setIsDisplay('none');
          setIsDisplayOwner('block');
        }
    }
  }, [dataOrganizationList]);

  useEffect(() => {
    if (!_.isEmpty(dataOrganizationList) && !_.isEmpty(activeOrganization)) {
      let activeOrgArray = dataOrganizationList;
      activeOrgArray = activeOrgArray ? activeOrgArray.filter(item => item.id === activeOrganization) : null;
      setActiveOrganizationArray(activeOrgArray ? activeOrgArray[0] : null);
    }
  }, [activeOrganization, dataOrganizationList]);


  return (
    <DefaultLayout>
      <div className="mx-auto ">
        <Breadcrumb pageName="Image Gallery" />
        <div>
        </div>
        <div style={{display: isDisplayOwner}}>
          <h1 className="font-medium text-black dark:text-white">
            You are not the owner of the Organization, thus your access is limited.
          </h1>
        </div>
        <div style={{display: isDisplay}}>
        <div className="py-3 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Data Source : Sans Paper Upvise
                </h3>
              </div>
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Organization : {activeOrganizationArray.name}
                </h3>
              </div>
              <div className="p-7">

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    Tags Available
                  </label>
                  <div className="flex flex-col gap-5.5 sm:flex-row">
                    <button
                      className="flex justify-center rounded bg-meta-3 px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    >
                      Tag 1
                    </button>
                    <button
                      className="flex justify-center rounded bg-meta-3 px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    >
                      Tag 2
                    </button>
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Sort Images By Date
                  </label>
                  <Select
                    defaultValue="ID_ASC"
                    onChange={(e) => {
                      setSort(e);
                      setImagesArray([]);
                    }}
                    style={{ width: '100%' }}
                  >
                    {sortOption.map((value, i) => (
                      <Option value={value.value} key={i}>
                        {value.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="mb-5.5">
                  <button
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    onClick={() => {
                      getImageLists(increment, sort);
                  }}
                  >
                    Search
                  </button>
                </div>


              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">

          </div>
        </div>

          {!_.isEmpty(imagesArray) && (
            <>
              <div className="py-3 gap-8">
                <div className="col-span-5 xl:col-span-3">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        Total Images : {total}
                      </h3>
                    </div>
                    <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                      <h3 className="font-medium text-black dark:text-white">
                        Current Image Batch : 1 - {batchEnd}
                      </h3>
                      <div className="py-5">
                        <button
                          className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                          onClick={() => {
                            setImagesArray([]);
                            getImageLists(increment + 100, sort);
                            setIncrement(increment + 100);
                            setBatchEnd(batchEnd + 100);
                          }}
                        >
                          Load next 100 images
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-3 gap-8">
                <div className="col-span-5 xl:col-span-3">
                  <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-3 py-3">
                    {!_.isEmpty(imagesArray) && (
                      <>
                      <Gallery images={imagesArray} onClick={(index, image) => {
                        setImageData(image);
                        onOpen();
                      }} />
                      <ImageModal isOpen={isOpen} onRequestClose={onClose} images={imageData} ></ImageModal>
                      </>
                    )
                    }
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </DefaultLayout>
    
  );
};

export default ImageGallery;