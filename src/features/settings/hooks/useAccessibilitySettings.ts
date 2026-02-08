import { useState, useEffect } from 'react';
import type {
  AccessibilitySettings,
  FontSize,
} from '../types/settings.types';
import { DEFAULT_SETTINGS } from '../types/settings.types';

const STORAGE_KEY = 'a11y-settings';

export function useAccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Apply settings to document
    const root = document.documentElement;
    root.setAttribute('data-font-size', settings.fontSize);
    root.setAttribute('data-reduced-motion', settings.reducedMotion.toString());

    if (settings.highContrast) {
      root.setAttribute('data-theme', 'high-contrast');
    } else {
      root.setAttribute('data-theme', 'default');
    }
  }, [settings]);

  const updateSettings = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const toggleReducedMotion = () => {
    setSettings((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setFontSize = (fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    toggleReducedMotion,
    toggleHighContrast,
    setFontSize,
    resetSettings,
  };
}
