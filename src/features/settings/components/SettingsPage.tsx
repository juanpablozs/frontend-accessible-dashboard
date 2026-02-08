import { AccessibilityControls } from './AccessibilityControls';
import { ToastContainer } from '@/components/ui/Toast';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <div className="container settings-page">
      <div className="settings-header">
        <h1>Accessibility Settings</h1>
        <p className="settings-intro">
          Customize your experience to make the application more comfortable for you. These
          preferences are saved locally and will persist across sessions.
        </p>
      </div>

      <AccessibilityControls />

      <div className="settings-info">
        <h2>Keyboard Navigation</h2>
        <ul>
          <li>
            <kbd>Tab</kbd> - Move forward through interactive elements
          </li>
          <li>
            <kbd>Shift + Tab</kbd> - Move backward through interactive elements
          </li>
          <li>
            <kbd>Enter</kbd> or <kbd>Space</kbd> - Activate buttons and links
          </li>
          <li>
            <kbd>Escape</kbd> - Close dialogs and modals
          </li>
          <li>
            <kbd>Arrow Keys</kbd> - Navigate within radio groups and select menus
          </li>
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}
