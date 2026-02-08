import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { SkipToContent } from './SkipToContent';
import { Navigation } from './Navigation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAccessibilitySettings } from '@/features/settings/hooks/useAccessibilitySettings';
import './MainLayout.css';

export function MainLayout() {
  const { settings } = useAccessibilitySettings();

  return (
    <div
      data-theme={settings.highContrast ? 'high-contrast' : 'default'}
      data-font-size={settings.fontSize}
      data-reduced-motion={settings.reducedMotion ? 'true' : 'false'}
    >
      <SkipToContent />

      <div className="layout">
        <header className="layout-header">
          <div className="container">
            <div className="header-content">
              <h1 className="site-title">
                <a href="/" className="site-title-link">
                  A11yFirst App
                </a>
              </h1>
              <Navigation />
            </div>
          </div>
        </header>

        <main id="main-content" className="layout-main" tabIndex={-1}>
          <Suspense
            fallback={
              <div className="container" style={{ padding: '2rem' }}>
                <LoadingSkeleton count={3} />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>

        <footer className="layout-footer">
          <div className="container">
            <p>
              &copy; {new Date().getFullYear()} A11yFirst App. Built with accessibility in mind.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
