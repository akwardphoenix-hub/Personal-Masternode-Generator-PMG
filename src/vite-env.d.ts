/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONGRESS_API?: string;
  readonly VITE_OFFLINE_ONLY?: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
