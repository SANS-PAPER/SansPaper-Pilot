// Root interface representing the entire query response
export interface GetUserListResponse {
    users: Users;
  }
  
  // Interface representing the users object
  export interface Users {
    nodes: UserNode[];
  }
  
  // Interface representing each user node
  export interface UserNode {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    jobTitle?: string;
    summaryBio?: string;
    profile?: UserProfile;
    availables?: AvailableConnection;
    reviews?: ReviewConnection & {totalAverageCount?: number };
    fillupForms?: FillupFormConnection & { totalCountTraining?: number }; 
  }
  
  // Interface representing the user's profile
  export interface UserProfile {
    photo?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    stateProvince?: string;
    country?: string;
  }
  
  // Interface representing the connection for availables
  export interface AvailableConnection {
    nodes: AvailableNode[];
  }
  
  // Interface representing each available node
  export interface AvailableNode {
    id: string;
    availableToWork: boolean;
    preferredLocation?: string;
    jobType?: JobType;
  }
  
  // Interface representing the job type
  export interface JobType {
    id: string;
    description: string;
  }
  
  // Interface representing the connection for reviews
  export interface ReviewConnection {
    nodes: ReviewNode[];
    totalCount: number;
  }
  
  // Interface representing each review node
  export interface ReviewNode {
    id: string;
    userId: string;
    recValue: number;
  }
  
  // Interface representing the connection for fillup forms
  export interface FillupFormConnection {
    nodes: FillupFormNode[];
    totalCount: number;
  }
  
  // Interface representing each fillup form node
  export interface FillupFormNode {
    id: string;
    userId: string;
    isDraft: boolean;
    form?: Form;
  }
  
  // Interface representing the form details
  export interface Form {
    id: string;
    name: string;
    isSpecial: boolean;
  }
  