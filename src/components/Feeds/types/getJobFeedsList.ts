// Interface for the JobFeed
export interface JobFeed {
    id: string;
    userId: string;
    jobTitle: string;
    jobDescription: string;
    location: string;
    requirement: string;
    reqWorkersDate: string;
    createdAt: string;
    updatedAt: string;
    expRange: string;
    amount: number;
    isActive: boolean;
    reqWorkersEndDate: string;
    user: User;
    workTypes: WorkType[];
    payPeriods: PayPeriod[];
  }
  
  // Interface for the User associated with the JobFeed
  interface User {
    id: string;
    parentId: string;
    name: string;
    jobTitle: string;
    organizationUsers: OrganizationUserConnection;
  }
  
  // Interface for the connection of OrganizationUsers
  interface OrganizationUserConnection {
    nodes: OrganizationUser[];
  }
  
  // Interface for the OrganizationUser node
  interface OrganizationUser {
    organization: Organization;
  }
  
  // Interface for the Organization associated with the OrganizationUser
  interface Organization {
    id: string;
    name: string;
    adminId: string;
  }
  
  // Interface for the WorkType associated with the JobFeed
  interface WorkType {
    id: string;
    name: string;
    organization: WorkTypeOrganization;
  }
  
  // Interface for the Organization associated with the WorkType
  interface WorkTypeOrganization {
    id: string;
    name: string;
    admin: Admin;
  }
  
  // Interface for the Admin associated with the WorkType's Organization
  interface Admin {
    id: string;
  }
  
  // Interface for the PayPeriod associated with the JobFeed
  interface PayPeriod {
    id: string;
    name: string;
    shortName: string;
  }
  
  // Root interface for the entire query response
  export interface GetJobFeedsResponse {
    jobFeeds: {
      nodes: JobFeed[];
    };
  }
  