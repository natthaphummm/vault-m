/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly DB_FILENAME_DEV: string
    readonly DB_FILENAME_PROD: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
