import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Profile from "./profile/page";
import { useUserStore } from "@/store/user/userStore";

export const metadata: Metadata = {
  title: "SPI Web",
  description: "This is Home for SPI Dashboard Template",
};

export default function Home() {
  return (
    <UserProvider>
        <Profile />
      </UserProvider>
  );
}
