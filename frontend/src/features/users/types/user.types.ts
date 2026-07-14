/** Mirrors components.schemas.Role. */
export interface Role {
  id: string;
  name: string;
  description?: string;
}

/** Mirrors components.schemas.User. */
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  roles: Role[];
  createdAt: string;
}

/**
 * Maps to the PATCH /users/me request body. Only `fullName` and
 * `avatarUrl` are accepted by the contract — username/email/roles are
 * not editable through this endpoint.
 */
export interface UpdateProfileRequest {
  fullName?: string;
  avatarUrl?: string;
}

/** Maps to the PATCH /users/me/password request body. */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/** Mirrors an entry of components.schemas.ProblemDetails.errors[]. */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Local-only application preferences. NOTE: the API contract has no
 * endpoint for persisting user preferences — only `/users/me` and
 * `/users/me/password` exist under the Users tag. These flags live in
 * session-only store state and are NOT sent to the backend. Wire this up
 * to a real endpoint once one is added to the contract.
 */
export interface UserPreferences {
  emailDailyDigest: boolean;
  playAttachmentsInline: boolean;
  reduceMotion: boolean;
}

export interface UserState {
  currentUser: User | null;
  preferences: UserPreferences;

  isLoadingProfile: boolean;
  isUpdatingProfile: boolean;
  isChangingPassword: boolean;

  profileError: string | null;
  updateProfileError: string | null;
  updateProfileFieldErrors: FieldError[];
  changePasswordError: string | null;
  changePasswordFieldErrors: FieldError[];
  changePasswordSuccess: boolean;
}
