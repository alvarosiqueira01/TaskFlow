import { defineStore } from 'pinia';
import { reactive, toRefs } from 'vue';
import { settingsService } from '../services/SettingsService';
import { parseProblemDetails } from '../composables/useSettingsErrorParser';
import type { SettingsState } from '../types/settings.types';

function createInitialState(): SettingsState {
  return {
    roles: [],
    isLoadingRoles: false,
    rolesError: null,

    lookedUpUserId: null,
    userRoles: [],
    isLoadingUserRoles: false,
    userRolesError: null,

    isSavingUserRoles: false,
    saveUserRolesError: null,
    saveUserRolesFieldErrors: [],
    saveUserRolesSuccess: false,
  };
}

export const useSettingsStore = defineStore('settings', () => {
  const state = reactive<SettingsState>(createInitialState());

  async function loadRoles() {
    state.isLoadingRoles = true;
    state.rolesError = null;
    try {
      state.roles = await settingsService.listRoles();
    } catch (err) {
      state.rolesError = parseProblemDetails(err).title ?? 'Failed to load the roles catalog.';
    } finally {
      state.isLoadingRoles = false;
    }
  }

  async function lookupUserRoles(userId: string) {
    state.lookedUpUserId = userId;
    state.isLoadingUserRoles = true;
    state.userRolesError = null;
    state.saveUserRolesSuccess = false;
    try {
      state.userRoles = await settingsService.getUserRoles(userId);
    } catch (err) {
      state.userRoles = [];
      state.userRolesError = parseProblemDetails(err).title ?? 'Failed to load roles for this user.';
    } finally {
      state.isLoadingUserRoles = false;
    }
  }

  async function saveUserRoles(userId: string, roleIds: string[]): Promise<boolean> {
    state.isSavingUserRoles = true;
    state.saveUserRolesError = null;
    state.saveUserRolesFieldErrors = [];
    state.saveUserRolesSuccess = false;
    try {
      await settingsService.updateUserRoles(userId, { roleIds });
      state.userRoles = await settingsService.getUserRoles(userId);
      state.saveUserRolesSuccess = true;
      return true;
    } catch (err) {
      const parsed = parseProblemDetails(err);
      state.saveUserRolesError = parsed.title ?? 'Failed to update roles for this user.';
      state.saveUserRolesFieldErrors = parsed.fieldErrors;
      return false;
    } finally {
      state.isSavingUserRoles = false;
    }
  }

  function resetUserRoleLookup() {
    state.lookedUpUserId = null;
    state.userRoles = [];
    state.userRolesError = null;
    state.saveUserRolesError = null;
    state.saveUserRolesFieldErrors = [];
    state.saveUserRolesSuccess = false;
  }

  function resetSettings() {
    Object.assign(state, createInitialState());
  }

  return {
    ...toRefs(state),
    loadRoles,
    lookupUserRoles,
    saveUserRoles,
    resetUserRoleLookup,
    resetSettings,
  };
});
