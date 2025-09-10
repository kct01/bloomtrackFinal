# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite development server with hot reload
- **Build for production**: `npm run build` - Creates optimized production build
- **Lint code**: `npm run lint` - Runs ESLint to check code quality
- **Preview build**: `npm run preview` - Preview the production build locally

## Testing

The project includes testing dependencies (@testing-library/react, @testing-library/jest-dom, vitest) but no test runner is configured in package.json scripts. Tests should be run with vitest directly: `npx vitest` or by adding test scripts to package.json.

## Architecture Overview

**BloomTrack** is a React-based pregnancy tracking application built with Vite. The app uses a multi-context architecture for state management and follows a component-based design system.

### Core Architecture

- **Frontend Framework**: React 19.1.0 with React Router for navigation
- **Build Tool**: Vite with React plugin
- **Styling**: CSS Modules with camelCase convention
- **State Management**: React Context API with useReducer pattern
- **UI Libraries**: Lucide React for icons, Framer Motion for animations

### Context Providers Architecture

The app uses a nested context provider structure in `src/App.jsx`:
```
AppProvider (global state) 
  └── PregnancyProvider (pregnancy calculations)
    └── CalendarProvider (appointments/events)
      └── MilestoneProvider (pregnancy milestones)
        └── JournalProvider (journal entries)
          └── ChatProvider (messaging)
```

### Key Context Files

- `src/context/AppContext.jsx` - Central app state, user data, pregnancy data with localStorage persistence
- `src/context/PregnancyContext.jsx` - Pregnancy calculations, week info, due date logic
- `src/context/CalendarContext.jsx` - Calendar events, appointments, mood tracking
- `src/context/MilestoneContext.jsx` - Milestone tracking and achievements
- `src/context/JournalContext.jsx` - Journal entries and emotional tracking
- `src/context/ChatContext.jsx` - Community chat and messaging features

### Component Structure

Components follow a consistent folder structure:
```
components/
├── common/ (reusable UI components)
├── calendar/ (calendar-specific components)
├── chat/ (messaging components)
├── journal/ (journal-specific components)
├── milestones/ (milestone tracking components)
├── pregnancy/ (pregnancy info components)
└── resources/ (educational content components)
```

Each component folder contains:
- `ComponentName.jsx` - Main component file
- `ComponentName.module.css` - CSS Module styles
- `index.js` - Export file

### Pages Structure

Main application pages in `src/pages/`:
- Dashboard - Main pregnancy overview with progress tracking
- Calendar - Appointments and mood logging
- Milestones - Pregnancy milestone tracking
- Journal - Personal journaling with mood tracking
- Chat - Community features and messaging
- Profile - User settings and preferences

### Data & Assets

- Static data files in `public/data/` (pregnancy weeks, milestones, educational content)
- Icons and images organized by category in `src/assets/`
- Pregnancy week images (week-1.svg through week-40.svg)

### Styling System

- CSS custom properties in `src/styles/variables.css`
- Global styles and resets in `src/styles/`
- Component-specific styles use CSS Modules
- Pregnancy-themed color palette with trimester-specific colors

### State Management Patterns

- Main app state uses useReducer with action types
- Local storage persistence for user data and pregnancy info
- Computed values for pregnancy calculations (current week, progress percentage)
- Context hooks (useApp, usePregnancy, etc.) for component access

### Mobile-First Design

- Responsive design with mobile-first approach
- Bottom navigation for mobile devices
- CSS Grid and Flexbox for layouts
- Touch-friendly UI elements

## Development Notes

- CSS Modules use camelCase convention (configured in vite.config.js)
- Component props follow pregnancy app conventions (gentle, celebration, milestone variants)
- Mock user data is used throughout for development/testing
- No backend integration - all data is stored in localStorage

## Day 5 Enhancements (Navigation & Polish)

### Navigation System ✅
- **Enhanced React Router integration** with proper NavLink active states
- **Page transitions** using Framer Motion with gentle entrance/exit animations
- **Improved accessibility** with ARIA labels, roles, and keyboard navigation
- **404/NotFound page** with pregnancy-themed styling and contextual navigation

### Accessibility Features ✅
- **ARIA labels and roles** throughout navigation components
- **Focus management** with visible focus indicators
- **Screen reader support** with proper semantic HTML structure
- **Keyboard navigation** optimized for all interactive elements
- **High contrast mode** support for users with visual needs

### Touch Optimization ✅
- **Enhanced touch targets** (minimum 44px) for pregnant users
- **Pregnancy-specific comfort mode** with larger text and controls
- **Touch-friendly interactions** with appropriate spacing
- **Mobile-first responsive design** tested across devices
- **Gesture optimization** with proper touch-action properties

### Responsive Design ✅
- **Mobile-first approach** with breakpoints at 480px, 768px, 1024px, 1400px
- **Flexible layouts** using CSS Grid and Flexbox
- **Scalable typography** with fluid font sizes
- **Touch-optimized spacing** for pregnancy-related physical changes
- **Device-specific optimizations** for tablets and desktops

### Component Architecture

#### Enhanced Components:
- **PageTransition** - Smooth page transitions with Framer Motion
- **NotFound** - Pregnancy-themed 404 page with contextual navigation
- **Header** - Accessible navigation with user menu and pregnancy info
- **BottomNavigation** - Touch-optimized navigation with proper active states

#### Accessibility Standards:
- **WCAG AA compliance** for color contrast and text sizing
- **Semantic HTML** with proper heading hierarchy
- **Focus management** with visible indicators and logical tab order
- **Screen reader compatibility** with descriptive labels

#### Performance Optimizations:
- **Code splitting** ready with React.lazy (suggested for future)
- **Production build** optimized: 587KB JS, 218KB CSS (gzipped: 177KB/32KB)
- **Framer Motion** animations with reduced motion support
- **Touch device detection** with appropriate interaction patterns

### Development Workflow

#### Build Process:
```bash
npm run dev     # Development server with hot reload
npm run build   # Production build with optimizations
npm run preview # Preview production build locally
npm run lint    # Code quality checks with ESLint
```

#### Testing Strategy:
- **Responsive testing** across mobile, tablet, desktop viewports
- **Accessibility testing** with screen readers and keyboard navigation
- **Touch interaction testing** on actual devices
- **Performance testing** with production builds

#### File Organization:
```
src/
├── components/common/PageTransition/    # New: Page transitions
├── pages/NotFound/                      # Enhanced: 404 page
├── styles/global.css                    # Enhanced: Touch optimizations
└── App.jsx                             # Enhanced: Route animations
```

### Pregnancy-Specific UX Considerations

#### Physical Comfort:
- **Larger touch targets** for reduced dexterity during pregnancy
- **Comfortable reading text** with appropriate line height and spacing
- **Reduced cognitive load** with clear navigation and intuitive interactions
- **Gentle animations** that don't cause motion sensitivity

#### Emotional Support:
- **Encouraging messaging** throughout the navigation experience
- **Celebration animations** for milestone achievements
- **Contextual help** and supportive error messages
- **Warm color palette** with pregnancy-themed styling

## Week 1 Status: COMPLETE ✅

All Week 1 deliverables achieved:
- ✅ Perfect navigation between all main pages
- ✅ Page transition animations implemented
- ✅ 404/NotFound page with pregnancy-themed styling
- ✅ Accessibility features (ARIA labels, focus management)
- ✅ Responsive design tested across mobile, tablet, desktop
- ✅ Touch interactions optimized for pregnant users
- ✅ Development documentation and component examples
- ✅ End-of-week testing and bug fixes completed