"use client";

import { useState, useEffect } from 'react';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import { listFilesInSpace } from '@/app/api/digitalOceanService';

const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fileKeys = await listFilesInSpace(); // Fetch the list of image file names
        
        // Construct URLs for each image
        const imageUrls = (fileKeys as string[]).map(
          (key) => `${process.env.DIGITAL_OCEAN_FILE_PATH}/${key}`
        );
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="container">
      <Breadcrumb pageName="Gallery" />
      <div className="gallery">
        {images.map((image, index) => (
          <div key={index} className="gallery-item">
            <img src={image} alt={`Gallery Image ${index + 1}`} className="gallery-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
