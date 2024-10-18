// Root interface representing the entire query response

export interface GetOrganizationListResponse {
  organizations: Organizations;
}

// Interface representing the organizations object
export interface Organizations {
  nodes: OrganizationNode[];
}


// Interface representing each organization node
export interface OrganizationNode {
  id: string;
  name: string;
  adminId: string;
}
