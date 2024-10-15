"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useUserStore } from "@/store/user/userStore";
import { useUserData } from "@/graphql/useUserData";
//import { PhotoData } from "./types/PhotoData";
import { FC, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { Button, Divider, Form, Input, Modal, Select, Spin, Switch } from 'antd';
import { client } from "@/app/api/client";
import { useUpdatePreferencesMutation, useUpdateProfileMutation, useUpdateSummaryMutation } from "@/gql/_generated";
import { showSuccessNotification, showErrorNotification } from "@/components/Notification/NotificationUtil";
import Lightbox from 'react-image-lightbox';
import ImageModal from "./ImageModal";
import './Gallery.css';
import AWS from 'aws-sdk';

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

  useEffect(() => {
    console.log(dataUser);
  }, [dataUser]);


  return (
    <DefaultLayout>
      <div className="mx-auto ">
        <Breadcrumb pageName="Image Gallery" />
        <div>
        </div>

        <div className="flex space-x-4 bg-white">
          Image Gallery Content
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ImageGallery;