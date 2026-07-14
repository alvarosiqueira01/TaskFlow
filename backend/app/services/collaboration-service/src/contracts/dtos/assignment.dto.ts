export interface AssignUserToTaskRequest {
  userId: string;
}

export interface AssignedUserResponse {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}
