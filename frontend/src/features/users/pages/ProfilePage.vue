<script setup lang="ts">
import { useUserProfile } from '../composables/useUserProfile';
import { useChangePassword } from '../composables/useChangePassword';
import ProfileHeader from '../components/ProfileHeader.vue';
import ProfileForm from '../components/ProfileForm.vue';
import ChangePasswordForm from '../components/ChangePasswordForm.vue';
import PreferencesPanel from '../components/PreferencesPanel.vue';

const {
  currentUser,
  isLoadingProfile,
  profileError,
  isUpdatingProfile,
  updateProfileError,
  updateProfileFieldErrors,
  saveProfile,
} = useUserProfile();

const {
  isChangingPassword,
  changePasswordError,
  changePasswordFieldErrors,
  changePasswordSuccess,
  submit: submitChangePassword,
} = useChangePassword();
</script>

<template>
  <div class="profile-page">
    <p v-if="profileError" class="profile-page__error" role="alert">{{ profileError }}</p>

    <ProfileHeader :user="currentUser" :loading="isLoadingProfile" />

    <div class="profile-page__grid">
      <ProfileForm
        :user="currentUser"
        :saving="isUpdatingProfile"
        :error="updateProfileError"
        :field-errors="updateProfileFieldErrors"
        @save="saveProfile"
      />

      <ChangePasswordForm
        :saving="isChangingPassword"
        :error="changePasswordError"
        :field-errors="changePasswordFieldErrors"
        :success="changePasswordSuccess"
        @submit="submitChangePassword"
      />
    </div>

    <PreferencesPanel />
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
}

.profile-page__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.profile-page__error {
  margin: 0;
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--color-danger-50, #fef2f2);
  color: var(--color-danger-700, #b91c1c);
}

@media (max-width: 900px) {
  .profile-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
