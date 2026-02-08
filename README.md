# A11y App - Accessibility-First Support Ticket Portal

A production-grade React + TypeScript application demonstrating best practices for web accessibility, keyboard navigation, and inclusive user experience design.

## 🎯 Project Overview

A11yFirst App is a support ticket management system built with accessibility as a first-class requirement. Every component, interaction, and feature has been designed with WCAG 2.1 guidelines in mind, ensuring the application is usable by everyone, including people using assistive technologies.

## ✨ Key Features

### Core Functionality
- **Ticket Management**: Create, view, search, filter, and manage support tickets
- **Status Tracking**: Update ticket status (Open → Pending → Resolved → Closed)
- **Internal Notes**: Add notes to tickets for team collaboration
- **Advanced Filtering**: Search by title/description, filter by status and priority
- **Real-time Updates**: Toast notifications for all actions

### Accessibility Features
- **Full Keyboard Navigation**: Every feature accessible without a mouse
- **Screen Reader Support**: Proper ARIA labels, live regions, and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Error Handling**: Accessible error messages with aria-live announcements
- **Skip Links**: Quick navigation to main content
- **Customizable Settings**: Reduced motion, high contrast, and adjustable text size
- **Responsive Design**: Works on all screen sizes with accessible touch targets

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend-accessible-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

### Test Structure
- **Unit Tests**: Individual component testing (`tests/unit/`)
- **Integration Tests**: Feature flow testing (`tests/integration/`)
- **Accessibility Tests**: Automated a11y checks with jest-axe (`tests/a11y/`)

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test TextField.test.tsx
```

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                      # Application shell
│   ├── router.tsx           # Route definitions
│   └── layout/              # Main layout components
├── features/                # Feature modules
│   ├── auth/               # Authentication
│   ├── tickets/            # Ticket management
│   └── settings/           # Accessibility settings
├── components/             # Shared components
│   ├── ui/                 # Accessible UI primitives
│   └── common/             # Common components
├── lib/                    # Utilities and config
│   ├── msw/               # Mock Service Worker setup
│   ├── queryClient.ts     # TanStack Query config
│   └── utils.ts           # Utility functions
├── hooks/                  # Custom React hooks
├── styles/                 # Global styles
└── types/                  # TypeScript types
```

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod
- **Testing**: Vitest + Testing Library + jest-axe
- **Mocking**: MSW (Mock Service Worker)
- **Linting**: ESLint (with jsx-a11y plugin)

## ♿ Accessibility Checklist

### ✅ Implemented Features

#### Semantic HTML
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [x] Semantic elements (button, nav, main, aside, article)
- [x] Proper form labels and fieldsets
- [x] Lists for collections (ul/ol with li)

#### Keyboard Navigation
- [x] All interactive elements keyboard accessible
- [x] Logical tab order throughout the application
- [x] Skip-to-content link for quick navigation
- [x] Escape key closes dialogs and modals
- [x] Enter/Space activates buttons
- [x] No keyboard traps

#### Focus Management
- [x] Visible focus indicators on all interactive elements
- [x] Focus restored after dialog closes
- [x] Focus moved to error summary on form validation
- [x] Focus moved to first invalid field on submit
- [x] Custom focus styles (never removed outline)

#### Screen Reader Support
- [x] ARIA labels where necessary
- [x] aria-describedby for help text and errors
- [x] aria-live regions for dynamic content (polite/assertive)
- [x] aria-invalid for form errors
- [x] aria-required for required fields
- [x] Proper button vs link usage
- [x] Loading states announced

#### Forms
- [x] All inputs have associated labels
- [x] Required fields clearly marked
- [x] Inline validation with accessible error messages
- [x] Error summary at form top with links to fields
- [x] Help text associated with inputs
- [x] Validation errors announced to screen readers

#### Color and Contrast
- [x] WCAG AA compliant color contrast (4.5:1 minimum)
- [x] Color not the only indicator (icons + text)
- [x] High contrast mode option
- [x] Status indicators have visual and text indicators

#### Motion and Animation
- [x] Reduced motion support (prefers-reduced-motion)
- [x] User toggle for reduced motion
- [x] Animations disabled or simplified when requested

#### Responsive Design
- [x] Mobile-friendly interface
- [x] Touch targets minimum 44x44px
- [x] Works at 200% zoom
- [x] Responsive layout (no horizontal scroll)

#### Error Handling
- [x] Error boundaries for graceful failures
- [x] Retry mechanisms for failed requests
- [x] Clear error messages
- [x] Empty states with helpful guidance

### Testing Coverage
- [x] Unit tests for UI components
- [x] Integration tests with keyboard navigation
- [x] Automated a11y tests with jest-axe
- [x] Focus management tests

## ⌨️ Keyboard Shortcuts

### Global Navigation
- `Tab` - Move to next interactive element
- `Shift + Tab` - Move to previous interactive element
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close dialogs and modals

### Form Navigation
- `Arrow Keys` - Navigate radio groups and select options
- `Tab` - Move between form fields
- `Enter` - Submit form

### Ticket List
- `Enter` / `Space` - Open ticket details (when focused on ticket card)

### Special Links
- Skip to main content link appears on first `Tab` press

## 🎨 Accessibility Settings

Users can customize their experience:

### Reduced Motion
Minimizes or disables animations and transitions throughout the application.

### High Contrast Mode
Increases contrast ratios between text and backgrounds for improved visibility.

### Text Size
Three size options (Small, Medium, Large) for comfortable reading.

All settings are persisted in localStorage and applied immediately.

## 📋 Design Decisions

### Focus Management Strategy
1. **Form Validation**: On submit with errors, focus moves to error summary, then first invalid field
2. **Dialog/Modal**: Focus trapped within dialog, restored to trigger element on close
3. **Route Changes**: Main content area receives focus for screen reader announcement
4. **Loading States**: Proper aria-busy and aria-live announcements

### Error Handling Pattern
1. **Error Summary**: Displayed at top of forms with list of errors
2. **Inline Errors**: Below each field with aria-described by link
3. **Live Regions**: Status updates announced via aria-live="polite"
4. **Visual + Text**: Icons combined with text for clarity

### ARIA Live Regions
- **Polite**: Toast notifications, ticket count updates, loading states
- **Assertive**: Critical errors, failed operations
- **Status**: Search results count, filter updates

### Component Design Philosophy
1. **Native First**: Use native HTML elements whenever possible
2. **Progressive Enhancement**: Works without JavaScript
3. **Semantic HTML**: Meaningful markup before ARIA
4. **Composable**: Reusable primitives with accessibility baked in
5. **Type Safe**: Full TypeScript coverage

## 🔍 Lighthouse Scores

Target scores (run `npm run build && npm run preview` then test with Lighthouse):

- **Performance**: 90+
- **Accessibility**: 95+ (aiming for 100)
- **Best Practices**: 95+
- **SEO**: 90+

### How to Test
1. Build the production version: `npm run build`
2. Preview: `npm run preview`
3. Open Chrome DevTools
4. Run Lighthouse audit
5. Take screenshot and place in `/docs/lighthouse-score.png`

## 🐛 Known Issues / Future Improvements

- [ ] Add Playwright E2E tests for complete user flows
- [ ] Implement dark mode as additional theme option
- [ ] Add keyboard shortcut documentation modal
- [ ] Implement virtual scrolling for large ticket lists
- [ ] Add export functionality for tickets
- [ ] Implement real-time collaboration features

## 📖 Resources

### WCAG Guidelines
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)

### Tools Used
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [NVDA](https://www.nvaccess.org/) - Screen reader testing (Windows)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) - Screen reader testing (macOS)

### Learning Resources
- [A11ycasts with Rob Dodson](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g)
- [The A11Y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

## 👥 Contributing

Contributions are welcome! Please ensure:

1. All new components include accessibility tests
2. ARIA attributes are used correctly and sparingly
3. Keyboard navigation is fully supported
4. Color contrast meets WCAG AA standards
5. Screen reader experience is tested

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

Built with a focus on inclusive design and accessibility best practices. Special thanks to the web accessibility community for their resources and guidelines.

---

**Remember**: Accessibility is not a feature, it's a requirement. Building accessible applications makes the web better for everyone.