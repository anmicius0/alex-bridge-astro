interface ImportMetaEnv {
  readonly PUBLIC_APP_ORIGIN?: string;

  readonly AUTH_SECRET: string;
  readonly AUTH_TRUST_HOST: string;
  readonly APP_BASE_URL: string;
  readonly AUTH0_ISSUER_BASE_URL: string;
  readonly AUTH0_CLIENT_ID: string;
  readonly AUTH0_CLIENT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
