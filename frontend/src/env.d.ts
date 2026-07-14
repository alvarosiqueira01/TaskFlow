/// <reference types="vite/client" />

// Vue components specificaation for Typescript
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Autocomplete variable definition
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Exemple: readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
