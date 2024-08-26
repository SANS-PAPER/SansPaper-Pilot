import Search from "@/components/AdminSearch/Search";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Search | SPI - Dashboard Template",
  description:
    "This is AdminSearch page for SPI  Tailwind CSS Admin Dashboard Template",
};

const AdminSearchPage = () => {
  return (
    <DefaultLayout>
      <Search />
    </DefaultLayout>
  );
};

export default AdminSearchPage;
