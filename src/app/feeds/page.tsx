import Feeds from "@/components/Feeds/Feeds";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Feeds | SPI - Dashboard Template",
  description:
    "This is Feeds page for SPI  Tailwind CSS Admin Dashboard Template",
};

const FeedsPage = () => {
  return (
    <DefaultLayout>
      <Feeds />
    </DefaultLayout>
  );
};

export default FeedsPage;
