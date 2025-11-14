/**
 * @nuge/config
 *
 * Centralized configuration package for the Nuge application.
 * Provides type-safe environment variables and application constants.
 */

// Environment configuration (with browser/server safety)
export {
  publicEnv,
  serverEnv,
  isServer,
  isDevelopment,
  isProduction,
  isTest,
  getBaseUrl,
  getFullUrl,
  validateEnv,
  type PublicEnv,
  type ServerEnv,
} from "./env";

// Application constants
export {
  MAP_CONFIG,
  PAGINATION,
  CACHE_CONFIG,
  LIMITS,
  TIME_CONFIG,
  SUBSCRIPTION,
  ROUTES,
  FEATURES,
  EXTERNAL_LINKS,
  STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "./constants";
