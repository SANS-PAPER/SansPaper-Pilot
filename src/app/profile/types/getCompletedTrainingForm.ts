// Define the Form interface
export interface Form {
    id: number;
    name: string;
    isSpecial: boolean | null;
  }
  
  export interface FormNode {
    id: number;
    userId: number;
    isDraft: number;
    form: Form;
  }
  
  // Define the FillupForms interface
  interface FillupForms {
    nodes: FormNode[];
  }
  
  // Define the GetCompletedFormTrainingResponse interface
 export interface GetCompletedFormTrainingResponse {
    fillupForms: FillupForms;
  }
  