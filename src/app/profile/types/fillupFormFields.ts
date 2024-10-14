// Interface for the fieldProperties nodes
interface FieldPropertyNode {
  fieldId: number;
  propertyId: string;
  value: string;
  updatedAt: string; // ISO date string
}

// Interface for the field object inside nodes
interface Field {
  fieldProperties: {
    nodes: FieldPropertyNode[];
  };
}

// Interface for the nodes in fillupFormFields
export interface FillupFormFieldNode {
  id: string; // Assuming ID is a string, adjust if it's different
  fillupFormId: number; // Adjusted to match BigInt as number
  fieldId: number;
  answer: string | null;
  field?: Field; // Optional because it might be null
}

// Interface for the entire fillupFormFields object
interface FillupFormFields {
  nodes: FillupFormFieldNode[];
}

// Interface for the entire query response
interface GetSkillDropDownListResponse {
  fillupFormFields: FillupFormFields;
}
