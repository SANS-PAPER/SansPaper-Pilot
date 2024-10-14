// Define the input type for the mutation
export interface UpdateUserInput {
    name?: string;
    phoneNumber?: string;
    jobTitle?: string;
    summaryBio?: string;
  }
  
  // Define the response type from the mutation
  export interface UpdateUserResponse {
    updateUser: {
      user: {
        id: string;
        name: string;
        phoneNumber: string;
        jobTitle: string;
        summaryBio: string;
      };
    };
  }
  
  // Define the variables type for the mutation
  export interface UpdateSummaryVariables {
    patch: UpdateUserInput;
  }
  