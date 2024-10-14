export interface PhotoField {
    id: string;
    fillupFormId: string;
    answer?: string;
    updatedAt?: string;
    field?: {
      id: string;
      component?: {
        id: string;
        description: string;
      };
    };
  }
  
  export interface FillupForm {
    id: string;
    userId: string;
    formId: string;
    updatedAt: string;
    fillupFormFields?: PhotoField[];
  }
  
  export interface PhotoData {
    fillupForms: {
      nodes: FillupForm[];
    };
  }
  
  export interface UseUserDataResult {
    dataUser: PhotoData | null;
    errorUser: Error | null;
    isLoadingUser: boolean;
  }
  