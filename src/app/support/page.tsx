import Support from "@/components/Support/Support";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Support | SPI - Dashboard Template",
  description:
    "This is Support page for SPI  Tailwind CSS Admin Dashboard Template",
};

const SupportPage = () => {
  return (
    <DefaultLayout>
      <Support />
    </DefaultLayout>
  );
};

export default SupportPage;
