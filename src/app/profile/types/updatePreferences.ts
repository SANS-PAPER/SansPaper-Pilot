// src/types/graphql.ts

// Define the nested input type for the mutation
interface PatchInput {
    availableToWork: boolean;
    jobTypeId: string; // Use string to represent bigint as string
    preferredLocation?: string; // Optional
  }
  
  // Define the input type for the mutation
  export interface UpdateAvailableInput {
    id: string; // or bigint if needed
    patch: PatchInput;
  }
  
  // Define the shape of the mutation response
  export interface UpdatePreferencesMutationResponse {
    updateAvailable: {
      available: {
        availableToWork: boolean;
        jobTypeId: string; // Use string to represent bigint as string
        preferredLocation: string;
      } | null; // Allow null if the available field can be null
    } | null; // Allow null if updateAvailable can be null
  }
  
  // Define the variables for the mutation
  export interface UpdatePreferencesMutationVariables {
    patch: UpdateAvailableInput; // Ensure this matches the UpdateAvailableInput type
  }
  