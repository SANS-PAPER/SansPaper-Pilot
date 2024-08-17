import {useEffect, useState} from 'react';
import {initializeGraphQLClient} from '@/app/api/client';
import {GetUploadedPhotosDocument} from '@/gql/_generated';
import { PhotoData } from '@/app/profile/types/photoData';

const usePhotoData = (userID: string) => {
  const [dataPhoto, setPhotoData] = useState<PhotoData[]>([]);
  const [errorPhoto, setError] = useState(null);
  const [isLoadingPhoto, setIsLoading] = useState(true);

  const [client, setClient] = useState<any>(null); // State to hold the GraphQL client

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize GraphQL client if not already initialized
        if (!client) {
          const initializedClient = await initializeGraphQLClient();
          setClient(initializedClient);
        }

        if (client) {
          const response = await fetchPhotoData(client, userID);
          setPhotoData(response);
        }
      } catch (error) {
        setError(errorPhoto);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Clean up function
    return () => {
      // Any cleanup code if necessary
    };
  }, [client]);

  return {dataPhoto, errorPhoto, isLoadingPhoto};
};

const fetchPhotoData = async (client:any, userID:any) => {
  try {
    const response = await client.request(GetUploadedPhotosDocument, {userID});

    return response;
  } catch (error) {
    // console.log('error fetching photo data >>>>>>>>>', error);
    throw error;
  }
};

export default usePhotoData;