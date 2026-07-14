/** Mirrors components.schemas.Role. */
export interface Role {
  id: string;
  name: string;
  description?: string;
}

/** Mirrors an entry of components.schemas.ProblemDetails.errors[]. */
export interface FieldError {
  field: string;
  message: string;
}

/** Maps to the PUT /users/{id}/roles request body. */
export interface UpdateUserRolesRequest {
  roleIds: string[];
}

export interface SettingsState {
  roles: Role[];
  isLoadingRoles: boolean;
  rolesError: string | null;

  lookedUpUserId: string | null;
  userRoles: Role[];
  isLoadingUserRoles: boolean;
  userRolesError: string | null;

  isSavingUserRoles: boolean;
  saveUserRolesError: string | null;
  saveUserRolesFieldErrors: FieldError[];
  saveUserRolesSuccess: boolean;
}
