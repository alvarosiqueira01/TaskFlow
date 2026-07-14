import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { userService } from '../services/UserService';
import { parseProblemDetails } from '../composables/useApiErrorParser';
import type { UserState, UpdateProfileRequest, ChangePasswordRequest, UserPreferences } from '../types/user.types';

function createInitialState(): UserState {
  return {
    currentUser: null,
    preferences: {
      emailDailyDigest: true,
      playAttachmentsInline: true,
      reduceMotion: false,
    },

    isLoadingProfile: false,
    isUpdatingProfile: false,
    isChangingPassword: false,

    profileError: null,
    updateProfileError: null,
    updateProfileFieldErrors: [],
    changePasswordError: null,
    changePasswordFieldErrors: [],
    changePasswordSuccess: false,
  };
}

export const useUserStore = defineStore('users', () => {
  const state = reactive<UserState>(createInitialState());

  async function loadCurrentUser() {
    state.isLoadingProfile = true;
    state.profileError = null;
    try {
      state.currentUser = await userService.getCurrentUser();
    } catch {
      state.profileError = 'Failed to load your profile.';
    } finally {
      state.isLoadingProfile = false;
    }
  }

  async function updateProfile(payload: UpdateProfileRequest): Promise<boolean> {
    state.isUpdatingProfile = true;
    state.updateProfileError = null;
    state.updateProfileFieldErrors = [];
    try {
      state.currentUser = await userService.updateCurrentUser(payload);
      return true;
    } catch (err) {
      const parsed = parseProblemDetails(err);
      state.updateProfileError = parsed.title ?? 'Failed to update your profile.';
      state.updateProfileFieldErrors = parsed.fieldErrors;
      return false;
    } finally {
      state.isUpdatingProfile = false;
    }
  }

  async function changePassword(payload: ChangePasswordRequest): Promise<boolean> {
    state.isChangingPassword = true;
    state.changePasswordError = null;
    state.changePasswordFieldErrors = [];
    state.changePasswordSuccess = false;
    try {
      await userService.changePassword(payload);
      state.changePasswordSuccess = true;
      return true;
    } catch (err) {
      const parsed = parseProblemDetails(err);
      state.changePasswordError = parsed.title ?? 'Failed to change your password.';
      state.changePasswordFieldErrors = parsed.fieldErrors;
      return false;
    } finally {
      state.isChangingPassword = false;
    }
  }

  /**
   * Session-only preference toggle. Not persisted remotely — see the
   * UserPreferences doc comment for why: no endpoint exists yet.
   */
  function setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) {
    state.preferences[key] = value;
  }

  function resetChangePasswordStatus() {
    state.changePasswordError = null;
    state.changePasswordFieldErrors = [];
    state.changePasswordSuccess = false;
  }

  function resetUser() {
    Object.assign(state, createInitialState());
  }

  return {
    ...toRefs(state),
    loadCurrentUser,
    updateProfile,
    changePassword,
    setPreference,
    resetChangePasswordStatus,
    resetUser,
  };
});
