import { Checkbox } from '@/components/ui/Checkbox';
import { useAccessibilitySettings } from '../hooks/useAccessibilitySettings';
import type { FontSize } from '../types/settings.types';
import './AccessibilityControls.css';

export function AccessibilityControls() {
  const { settings, toggleReducedMotion, toggleHighContrast, setFontSize } =
    useAccessibilitySettings();

  return (
    <div className="a11y-controls">
      <section aria-labelledby="motion-heading">
        <h3 id="motion-heading">Motion Preferences</h3>
        <Checkbox
          label="Reduce motion"
          checked={settings.reducedMotion}
          onChange={toggleReducedMotion}
          helperText="Minimizes animations and transitions throughout the application"
        />
      </section>

      <section aria-labelledby="contrast-heading">
        <h3 id="contrast-heading">Contrast</h3>
        <Checkbox
          label="High contrast mode"
          checked={settings.highContrast}
          onChange={toggleHighContrast}
          helperText="Increases contrast between text and background for better visibility"
        />
      </section>

      <section aria-labelledby="text-size-heading">
        <h3 id="text-size-heading">Text Size</h3>
        <fieldset className="font-size-fieldset">
          <legend className="sr-only">Choose text size</legend>
          <div className="font-size-options">
            <label className="font-size-option">
              <input
                type="radio"
                name="fontSize"
                value="small"
                checked={settings.fontSize === 'small'}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
              />
              <span>Small</span>
            </label>
            <label className="font-size-option">
              <input
                type="radio"
                name="fontSize"
                value="medium"
                checked={settings.fontSize === 'medium'}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
              />
              <span>Medium</span>
            </label>
            <label className="font-size-option">
              <input
                type="radio"
                name="fontSize"
                value="large"
                checked={settings.fontSize === 'large'}
                onChange={(e) => setFontSize(e.target.value as FontSize)}
              />
              <span>Large</span>
            </label>
          </div>
        </fieldset>
        <p className="helper-text">
          Adjusts the size of text throughout the application
        </p>
      </section>
    </div>
  );
}
