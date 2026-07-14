<script setup lang="ts">
import { useRolesCatalog } from '../composables/useRolesCatalog';
import { useUserRoleManager } from '../composables/useUserRoleManager';
import RolesCatalogList from '../components/RolesCatalogList.vue';
import UserRoleLookupForm from '../components/UserRoleLookupForm.vue';
import UserRoleEditor from '../components/UserRoleEditor.vue';

const { roles, isLoadingRoles, rolesError, reloadRoles } = useRolesCatalog();

const {
  lookedUpUserId,
  userRoles,
  isLoadingUserRoles,
  userRolesError,
  isSavingUserRoles,
  saveUserRolesError,
  saveUserRolesFieldErrors,
  saveUserRolesSuccess,
  lookupUser,
  saveRoles,
} = useUserRoleManager();
</script>

<template>
  <div class="settings-page">
    <header class="settings-page__header">
      <h2>Settings</h2>
      <p class="settings-page__subtitle">Administrative role management.</p>
    </header>

    <div class="settings-page__grid">
      <RolesCatalogList
        :roles="roles"
        :loading="isLoadingRoles"
        :error="rolesError"
        @retry="reloadRoles"
      />

      <div class="settings-page__user-roles">
        <UserRoleLookupForm @lookup="lookupUser" />

        <UserRoleEditor
          :user-id="lookedUpUserId"
          :available-roles="roles"
          :assigned-roles="userRoles"
          :loading="isLoadingUserRoles"
          :load-error="userRolesError"
          :saving="isSavingUserRoles"
          :save-error="saveUserRolesError"
          :save-field-errors="saveUserRolesFieldErrors"
          :save-success="saveUserRolesSuccess"
          @save="saveRoles"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.settings-page__header h2 {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.settings-page__subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}

.settings-page__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.settings-page__user-roles {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 900px) {
  .settings-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
