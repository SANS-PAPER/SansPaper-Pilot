// types/UserProfile.ts
interface GetUserDetailsByIdResponse {
    users: {
      nodes: UserProfile[];
    };
  }

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    jobTitle?: string;
    summaryBio?: string;
    isActive?: boolean;
    profile?: {
        photo?: string;
        address?: string;
        firstName?: string;
        lastName?: string;
        city?: string;
        stateProvince?: string;
        country?: string;
    };
    availables: {
        nodes: AvailableNode[];
      };
    }

    interface AvailableNode {
        availableToWork: boolean;
        preferredLocation: string;
        jobType: JobType;
      }

      interface JobType {
        id: number;
        description: string;
      }
  
  export interface UseUserDataResult {
    dataUser: UserProfile[];
    errorUser: Error | null;
    isLoadingUser: boolean;
  }
  