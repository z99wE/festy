/**
 * Festiya Feature Flags Configuration
 * Controls progressive rollout of celebration modules.
 */

export const FEATURE_FLAGS = {
  FEATURE_CELEBRATION_GLOBE: true,
  FEATURE_ECONOMICS_ABACUS: true,
  FEATURE_FESTI_AI_PLANNER: true,
} as const;

export type FeatureFlagKey = keyof typeof FEATURE_FLAGS;

/**
 * Check if a specific feature flag is currently active.
 * @param flag Feature flag identifier
 */
export function isFeatureActive(flag: FeatureFlagKey): boolean {
  return Boolean(FEATURE_FLAGS[flag]);
}
