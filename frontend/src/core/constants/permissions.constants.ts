/**
 * core/constants/permissions.constants.ts
 *
 * Role and permission identifiers used for RBAC (NFR-11).
 * Role names must match the `name` values returned by `/roles` and
 * embedded in `User.roles[].name` (see swagger.yaml `Role` schema,
 * example value: "ADMIN").
 *
 * Permission identifiers are a frontend-only concept: they group one
 * or more roles that are allowed to perform a given capability, as
 * described in PRD section 4 ("Actors").
 */

/** Canonical role names as stored/returned by the backend. */
export const ROLE_NAMES = {
  ADMINISTRATOR: 'ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  TEAM_MEMBER: 'TEAM_MEMBER',
  AUTHENTICATED_USER: 'USER',
} as const;

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES];

/**
 * Frontend permission identifiers mapped to the roles allowed to
 * perform them. Used by `core/auth/permission-evaluator.ts` and by
 * route meta (`meta.permission`) to gate navigation and UI elements.
 */
export const PERMISSIONS = {
  MANAGE_CATEGORIES: [ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.ADMINISTRATOR],
  ASSIGN_TASKS: [ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.ADMINISTRATOR],
  VIEW_DASHBOARDS: [ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.ADMINISTRATOR],
  GENERATE_REPORTS: [ROLE_NAMES.PROJECT_MANAGER, ROLE_NAMES.ADMINISTRATOR],
  MANAGE_USERS: [ROLE_NAMES.ADMINISTRATOR],
  MANAGE_PERMISSIONS: [ROLE_NAMES.ADMINISTRATOR],
  VIEW_LOGS: [ROLE_NAMES.ADMINISTRATOR],
  CONFIGURE_SYSTEM: [ROLE_NAMES.ADMINISTRATOR],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
