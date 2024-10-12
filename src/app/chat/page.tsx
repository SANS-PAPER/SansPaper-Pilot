import Chat from "@/components/Chat/Chat";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Chat | SPI - Dashboard Template",
  description:
    "This is Chat page for SPI  Tailwind CSS Admin Dashboard Template",
};

const ChatPage = () => {
  return (
    <DefaultLayout>
      <Chat />
    </DefaultLayout>
  );
};

export default ChatPage;
