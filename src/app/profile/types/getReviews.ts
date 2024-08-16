export interface Review {
    id: string;
    userId: bigint;
    recValue: number;
    recText: string;
    recommenderUserId: string;
    recommenderProfilePic: string;
    createdAt: string;
  }

  interface GetReviewsResponse {
    reviews: {
      nodes: Review[];
    };
  }
  