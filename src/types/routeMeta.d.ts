import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresUnAuth?: boolean
    isPublic?: boolean
    // isGuest?: boolean
  }
}

export {}
