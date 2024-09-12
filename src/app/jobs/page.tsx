import Jobs from "@/components/Jobs/Jobs";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Jobs | SPI - Dashboard Template",
  description:
    "This is Jobs page for SPI  Tailwind CSS Admin Dashboard Template",
};

const JobsPage = () => {
  return (
    <DefaultLayout>
      <Jobs />
    </DefaultLayout>
  );
};

export default JobsPage;
