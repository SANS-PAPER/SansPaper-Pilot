import Gallery from "@/components/Gallery/Gallery";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
  title: "Gallery | SPI - Dashboard Template",
  description:
    "This is Gallery page for SPI  Tailwind CSS Admin Dashboard Template",
};

const GalleryPage = () => {
  return (
    <DefaultLayout>
      <Gallery />
    </DefaultLayout>
  );
};

export default GalleryPage;
