import OpenChat from "@/components/Chat/OpenChat";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Private Chat | SPI - Dashboard Template",
  description:
    "This is Private Chat page for SPI  Tailwind CSS Admin Dashboard Template",
};

const OpenChatPage = () => {
  return (
    <DefaultLayout>
      <OpenChat />
    </DefaultLayout>
  );
};

export default OpenChatPage;
