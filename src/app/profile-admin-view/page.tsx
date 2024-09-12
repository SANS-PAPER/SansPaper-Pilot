import { GetServerSideProps } from 'next';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { GetUserListResponse, UserNode, UserProfile } from '@/components/Jobs/types/getUserList';
import useGetUserList from '@/graphql/getUserList';
import { initializeGraphQLClient } from '../api/client';
import { GetUserListDocument } from '@/gql/_generated';
import ProfileAdminView from '@/components/Jobs/ProfileAdminView';

interface ProfileAdminViewProps {
  user: UserProfile | null;
}

const ProfileAdminPage = ({ user }: ProfileAdminViewProps) => {
  const { dataUserList, errorUserList, isLoadingUserList } = useGetUserList();

  //const user = dataUserList?.find((user) => user.id === initialUser?.id) || initialUser;

  return (
    <DefaultLayout>
      <ProfileAdminView />
    </DefaultLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.params || {};
  
//   // Fetch user data based on the ID
//   const client = await initializeGraphQLClient();
//   const response: UserNode[] = await client.request(GetUserListDocument);
//   const user = response.find((user: UserNode) => user.id === id) || null;

//   return {
//     props: {
//       initialUser: user,
//     },
//   };
// };

export default ProfileAdminPage;
