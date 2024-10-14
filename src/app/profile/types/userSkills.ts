// Interface for a single profile node
export interface SkillNode {
  skills: string[];
}

// Interface for the profiles array in the response
export interface UserSkills {
  nodes: SkillNode[];
}

// Interface for the entire query response
export interface GetFillupFormIdFromProfileResponse {
  profiles: UserSkills;
}
