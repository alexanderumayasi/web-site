declare module '#imports' {
  export const useHead: typeof import('nuxt/app')['useHead'];
  export const useRuntimeConfig: typeof import('nuxt/app')['useRuntimeConfig'];
  export const defineNuxtRouteMiddleware: typeof import('nuxt/app')['defineNuxtRouteMiddleware'];
  export const navigateTo: typeof import('nuxt/app')['navigateTo'];
  export const useNuxtApp: typeof import('nuxt/app')['useNuxtApp'];
  export const useRequestHeaders: typeof import('nuxt/app')['useRequestHeaders'];
  export const definePageMeta: (meta: Record<string, any>) => void;
}

declare global {
  const defineNuxtConfig: typeof import('nuxt/config').defineNuxtConfig;
}

export {};
