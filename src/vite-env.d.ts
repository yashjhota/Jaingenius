/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REGISTRATION_FORM_URL?: string;
  readonly NEXT_PUBLIC_REGISTRATION_FORM_URL?: string;
  readonly [key: string]: string | boolean | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
