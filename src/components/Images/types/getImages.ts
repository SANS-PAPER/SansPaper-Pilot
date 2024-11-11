// Root interface representing the entire query response

export interface GetImagesResponse {
  images: Images;
}

// Interface representing the organizations object
export interface Images {
  nodes: ImagesNode[];
  totalCount: number;
}

// Interface representing each organization node
export interface ImagesNode {
  id: string;
  image: string;
  fillupFormId: string;
  organizationId: string;
}
