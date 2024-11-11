"use client";
import { FC, useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useUserData } from "@/graphql/useUserData";
import { useUserStore } from "@/store/user/userStore";
import  useGetOrganizationList  from "@/graphql/getOrganizationList";
import _ from 'lodash';

// export const metadata: Metadata = {
//   title: "Settings | SPI - Dashboard Template",
//   description:
//     "This is Settings page for SPI - Tailwind CSS Admin Dashboard Template",
// };

const Settings: FC = () => {

  const { userId, userAuth } = useUserStore();
  const { dataUser, errorUser, isLoadingUser } = useUserData(userId || "");
  const { dataOrganizationList, errorOrganizationList, isLoadingOrganizationList } = useGetOrganizationList(true);
  const [userOrg, setUserOrg] = useState<any>([]);

  useEffect(() => {
    if (!_.isEmpty(dataUser?.organizationUsers?.nodes) && !_.isEmpty(dataOrganizationList)) {
      let newArray = dataUser?.organizationUsers?.nodes;

      newArray = newArray?.map(item => {
        let foundObj = dataOrganizationList?.find(obj => obj.id === item.organizationId);
        // Get the organization setting
        let orgSetting = [
          {
            id: 13,
            group_id: 3,
            uuid: "7e7aea9e-c5fa-42a6-9e86-73ef8756693c",
            description: "SansPaper Pilot Share Data",
            created_at: "2024-10-29T05:58:18.000000Z",
            updated_at: "2024-10-29T05:58:18.000000Z",
            deleted_at: null,
            setting_id: 2,
            organization_id: 29,
            value: "{\"share_data\": true}"
          },
          {
            id: 96,
            group_id: 3,
            uuid: "4ea086f8-0b10-4ece-8568-455a733c4c63",
            description: "SansPaper Pilot File List",
            created_at: "2024-10-29T05:58:18.000000Z",
            updated_at: "2024-10-29T05:58:18.000000Z",
            deleted_at: null,
            setting_id: 3,
            organization_id: 29,
            value: "[{\"file1\": \"https://spf-assets-aus.syd1.digitaloceanspaces.com/hVtbxKOw8y2YVFKz4Ao4kvLcuh5OHHRAb3E4pgZG.pdf\"},{\"file2\":\"https://spf-assets-aus.syd1.digitaloceanspaces.com/jIx4oFU1Ad1i1JWmtWLNjI5FZygUcr7c0drK3VGV.pdf\"}]"
          },
          {
            id: 97,
            group_id: 3,
            uuid: "d7e5468c-9135-4406-87ce-7b2a0edfcaef",
            description: "SansPaper Pilot Last Fillupform",
            created_at: "2024-10-29T05:58:18.000000Z",
            updated_at: "2024-10-29T05:58:18.000000Z",
            deleted_at: null,
            setting_id: 4,
            organization_id: 29,
            value: "{\"id\": 9907}"
          },
          {
            id: 98,
            group_id: 3,
            uuid: "c8763789-90fb-410a-95b5-32c061bfdfe9",
            description: "SansPaper Pilot Upvise Account",
            created_at: "2024-10-29T05:58:18.000000Z",
            updated_at: "2024-10-29T05:58:18.000000Z",
            deleted_at: null,
            setting_id: 5,
            organization_id: 29,
            value: "[{\"email\":\"mdw_blocked@platformers.com.au\"},{\"password\":\"7akKv$$2@CJgNK\"}]"
          }
        ];

        let shareDataArr = orgSetting.find(obj => obj.description === 'SansPaper Pilot Share Data');
        let shareData = shareDataArr? JSON.parse(shareDataArr.value) : null;

        let fileListArr = orgSetting.find(obj => obj.description === 'SansPaper Pilot File List');
        let fileList = fileListArr? JSON.parse(fileListArr.value) : null;

        let lastFillupformArr = orgSetting.find(obj => obj.description === 'SansPaper Pilot Last Fillupform');
        let lastFillupform = lastFillupformArr? JSON.parse(lastFillupformArr.value) : null;

        let upviseAccountArr = orgSetting.find(obj => obj.description === 'SansPaper Pilot Upvise Account');
        let upviseAccount = upviseAccountArr? JSON.parse(upviseAccountArr.value) : null;


        return { ...item, organization: foundObj, setting: {
          shareData ,fileList, lastFillupform, upviseAccount
       } };
      });
      setUserOrg(newArray);
      //console.log('newArray', newArray);
    }
  }, [dataUser, dataOrganizationList]);

  useEffect(() => {
    if (!_.isEmpty(userOrg) ) {
      console.log('userOrg', userOrg);
    }
  }, [userOrg]);


  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Organization Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-5">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-3 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="fullName"
                          id="fullName"
                          placeholder="Devid Jhon"
                          defaultValue={dataUser?.name}
                          disabled={true}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Email Address
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray px-3 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="+990 3343 7865"
                        defaultValue={dataUser?.email}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {/* <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-8 py-5">
          <div className="col-span-5 xl:col-span-5">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Owned Organization(s) Settings
                </h3>
              </div>
              {!_.isEmpty(userOrg) && (
                <>
                  {userOrg.map((item: any, i: any) => (
                    <div key={i}>
                      <div className="p-7 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form action="#">
                          <div className="mb-5.5 flex flex-col-8 gap-5.5 sm:flex-row">
                            <div className="w-full">
                              <label
                                className="mb-3 block text-sm font-medium text-black dark:text-white"
                                htmlFor="fullName"
                              >
                                Organization Name : <strong>{item.organization.name}</strong>
                              </label>
                              <div className="relative">
                                <div className="flex py-2">
                                  <input
                                    type="checkbox"
                                    name="optAI"
                                    id="optAI"
                                    defaultChecked={item.setting?.shareData?.share_data? item.setting.shareData.share_data : true}
                                  />
                                  <label
                                    className="ml-2 block text-sm font-medium text-black dark:text-white"
                                    htmlFor="optAI"
                                  >
                                    Share <strong>{item.organization.name}</strong> data with Sans Paper Pilot AI Services
                                  </label>
                                </div>
                                <div className="flex py-2">
                                  <button
                                    className="flex justify-center rounded bg-meta-4 px-6 py-2 font-small text-gray hover:bg-opacity-90"
                                    type="button"
                                  >
                                    Upload
                                  </button>
                                  <span
                                    className="pt-2 ml-2 block text-sm font-medium text-black dark:text-white"
                                  >
                                    Upload a file to the Sans Paper Pilot AI Model Learning (pdf, csv, xls, doc, docx).
                                  </span>
                                </div>
                                <div className="grid py-2">
                                  {!_.isEmpty(item.setting.fileList) && (
                                    <div>
                                      <span
                                        className="pb-5 pt-2 ml-2 block text-sm font-medium text-black dark:text-white"
                                      >
                                        File Lists
                                      </span>
                                      {item.setting.fileList.map((image: any, i: any) => (
                                        <div className="pb-5">
                                          {Object.entries(image).map(([key, value]) => (
                                            <div>
                                              <span className="pt-2 ml-2 block text-sm font-medium text-black dark:text-white">{key}: {String(value)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-4.5">
                            <button
                              className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                              type="submit"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {/* <div className="p-7">
                <form action="#">
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Organization Name : HCM Constructions
                      </label>
                      <div className="relative">
                        <div className="flex py-2">
                          <input
                            type="checkbox"
                            name="optAI"
                            id="optAI"
                          />
                          <label
                            className="ml-2 block text-sm font-medium text-black dark:text-white"
                            htmlFor="optAI"
                          >
                            Share HCM Constructions data with Sans Paper Pilot AI Services 
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div> 
                </form>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
