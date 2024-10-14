"use client";
import LoginApi from "@/store/user/loginAuth0";
import { useUser } from "@auth0/nextjs-auth0/client";

import Loader from "@/components/common/Loader";
import React, { useEffect } from "react";
import SignIn from "@/app/loginpage";
import { useUserStore } from "@/store/user/userStore";


export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { user, error, isLoading } = useUser();

    const [isDataAvailable, setIsDataAvailable] = React.useState(false);
    const [stopLoader, setStopLoader] = React.useState(false);
    const { setUserId, setUserAuth } = useUserStore();

  
    useEffect(() => {
      if (user) {
        const validateUserSpf = async () => {
          try {
            const isUserExistSpf = await LoginApi(user.email);
    
            if (isUserExistSpf.data?.data.loginSpf.status !== -6) {
              setIsDataAvailable(true);
              setUserId(isUserExistSpf.data?.data.loginSpf.id);
              setUserAuth(user);
            } else {
              setIsDataAvailable(false);
              setStopLoader(true);
              alert('Sorry, the user account does not exist. Please contact the system administrator for assistance.');
            }
          } catch (error) {
            console.error("Error fetching isUserExistSpf:", error);
          }
        };
    
        validateUserSpf();
      }
    }, [user, setUserId, setUserAuth, setIsDataAvailable, setStopLoader]);  // Added dependencies
    
    
    if (isLoading) return <div><Loader /></div>;
    if (error) return <div>{error.message}</div>;
  
    return (
<>
{user ? isDataAvailable ? children  : stopLoader ? <SignIn/> : <Loader/>: <SignIn />}

</>
      




      
    );
  }