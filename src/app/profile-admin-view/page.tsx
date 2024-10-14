"use client";

import { useSearchParams } from "next/navigation";
import ProfileAdminView from "@/components/Jobs/ProfileAdminView";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { UserNode } from "@/components/AdminSearch/types/getUserList";
import { useEffect, useState } from "react";

const ProfileAdminViewPage = () => {
  const searchParams = useSearchParams();  // Using next/navigation
  const [userID, setUserID] = useState<string | null>(null);
  const [receiverID, setReceiverID] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserNode | null>(null);

  useEffect(() => {
    const userID = searchParams.get("userID") || '';
    const receiverID = searchParams.get("receiverID");
    const profileDataString = searchParams.get("profileData");

    if (userID && receiverID && profileDataString) {
      setUserID(userID);
      setReceiverID(receiverID);

      try {
        const parsedProfileData = JSON.parse(profileDataString);
        setProfileData(parsedProfileData);
      } catch (error) {
        console.error("Error parsing profileData:", error);
      }
    }
  }, [searchParams]);

  return (
    <DefaultLayout>
      <ProfileAdminView/>
    </DefaultLayout>
  );
};

export default ProfileAdminViewPage;
