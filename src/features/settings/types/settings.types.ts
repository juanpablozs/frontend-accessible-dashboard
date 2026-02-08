export type FontSize = 'small' | 'medium' | 'large';

export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: FontSize;
}

export const DEFAULT_SETTINGS: AccessibilitySettings = {
  reducedMotion: false,
  highContrast: false,
  fontSize: 'medium',
};
