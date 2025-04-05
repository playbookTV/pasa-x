/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL?: string;
    readonly VITE_OPENAI_API_KEY?: string;
    readonly VITE_CLOUDFLARE_R2_URL?: string;
    readonly VITE_CLOUDFLARE_R2_ACCESS_KEY_ID?: string;
    readonly VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY?: string;
    readonly [key: string]: string | undefined;
  };
} 