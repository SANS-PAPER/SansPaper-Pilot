import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import ImageGallery from "./imageGallery/page";
import { useUserStore } from "@/store/user/userStore";

export const metadata: Metadata = {
  title: "Sans Paper Pilot",
  description: "This is Home for Sans Paper Pilot",
};

export default function Home() {
  return (
    <UserProvider>
        <ImageGallery />
      </UserProvider>
  );
}
