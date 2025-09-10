# BloomTrack - Technical Specifications
**Student:** Kasey  
**Project:** Motherhood Support App

---

## 🛠️ Recommended Tech Stack

### Core Frontend Technologies
```yaml
Frontend Framework: React 18.2+
Build Tool: Vite 5.0+
Language: JavaScript (ES2022+)
Styling: CSS3 + CSS Modules
State Management: React Context API + useReducer
Routing: React Router DOM v6
Package Manager: npm
```

### Development Dependencies
```yaml
Development Server: Vite Dev Server
Code Quality: ESLint + Prettier
Type Checking: PropTypes (optional TypeScript upgrade path)
Testing: Vitest + React Testing Library
Bundling: Vite (Rollup under the hood)
Hot Reload: Vite HMR
```

### Production Dependencies
```yaml
React Core: react, react-dom
Routing: react-router-dom
Icons: lucide-react (calendar, heart, baby, message icons)
Date Handling: date-fns (pregnancy calculations, calendar)
Calendar: react-calendar (appointment and mood tracking)
File Handling: Native File API for milestone photos
Local Storage: Native localStorage with custom hooks
Animations: CSS transitions + Framer Motion (milestone celebrations)
```

### Data & Content Management
```yaml
Pregnancy Data: Static JSON with week-by-week information
Milestone System: Custom data structure with media support
Journal Entries: Date-indexed localStorage system
Chat Messages: Mock real-time messaging with local state
Educational Content: Static JSON with categorized resources
```

### Deployment & Build
```yaml
Build Output: Static site (SPA)
Deployment: Netlify or Vercel (with form handling)
Asset Optimization: Vite built-in optimization
File Upload: Client-side file handling for photos
Notifications: Browser Notification API for reminders
```

---

## 📁 Complete File Structure Tree

```
bloomtrack-app/
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   └── data/
│       ├── pregnancyWeeks.json
│       ├── milestones.json
│       ├── educationalContent.json
│       └── chatMessages.json
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── index.js
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Card.module.css
│   │   │   │   └── index.js
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Modal.module.css
│   │   │   │   └── index.js
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Layout.module.css
│   │   │   │   └── index.js
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Header.module.css
│   │   │   │   └── index.js
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Footer.module.css
│   │   │   │   └── index.js
│   │   │   └── LoadingSpinner/
│   │   │       ├── LoadingSpinner.jsx
│   │   │       ├── LoadingSpinner.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── pregnancy/
│   │   │   ├── ProgressBar/
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── ProgressBar.module.css
│   │   │   │   └── index.js
│   │   │   ├── WeeklyInfo/
│   │   │   │   ├── WeeklyInfo.jsx
│   │   │   │   ├── WeeklyInfo.module.css
│   │   │   │   └── index.js
│   │   │   ├── TrimesterBadge/
│   │   │   │   ├── TrimesterBadge.jsx
│   │   │   │   ├── TrimesterBadge.module.css
│   │   │   │   └── index.js
│   │   │   ├── DueDateCountdown/
│   │   │   │   ├── DueDateCountdown.jsx
│   │   │   │   ├── DueDateCountdown.module.css
│   │   │   │   └── index.js
│   │   │   └── BabyDevelopment/
│   │   │       ├── BabyDevelopment.jsx
│   │   │       ├── BabyDevelopment.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarView/
│   │   │   │   ├── CalendarView.jsx
│   │   │   │   ├── CalendarView.module.css
│   │   │   │   └── index.js
│   │   │   ├── AppointmentForm/
│   │   │   │   ├── AppointmentForm.jsx
│   │   │   │   ├── AppointmentForm.module.css
│   │   │   │   └── index.js
│   │   │   ├── MoodLogger/
│   │   │   │   ├── MoodLogger.jsx
│   │   │   │   ├── MoodLogger.module.css
│   │   │   │   └── index.js
│   │   │   ├── EventCard/
│   │   │   │   ├── EventCard.jsx
│   │   │   │   ├── EventCard.module.css
│   │   │   │   └── index.js
│   │   │   └── ReminderSystem/
│   │   │       ├── ReminderSystem.jsx
│   │   │       ├── ReminderSystem.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── milestones/
│   │   │   ├── MilestoneTracker/
│   │   │   │   ├── MilestoneTracker.jsx
│   │   │   │   ├── MilestoneTracker.module.css
│   │   │   │   └── index.js
│   │   │   ├── MilestoneCard/
│   │   │   │   ├── MilestoneCard.jsx
│   │   │   │   ├── MilestoneCard.module.css
│   │   │   │   └── index.js
│   │   │   ├── MilestoneForm/
│   │   │   │   ├── MilestoneForm.jsx
│   │   │   │   ├── MilestoneForm.module.css
│   │   │   │   └── index.js
│   │   │   ├── PhotoUpload/
│   │   │   │   ├── PhotoUpload.jsx
│   │   │   │   ├── PhotoUpload.module.css
│   │   │   │   └── index.js
│   │   │   └── CelebrationModal/
│   │   │       ├── CelebrationModal.jsx
│   │   │       ├── CelebrationModal.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── journal/
│   │   │   ├── JournalEditor/
│   │   │   │   ├── JournalEditor.jsx
│   │   │   │   ├── JournalEditor.module.css
│   │   │   │   └── index.js
│   │   │   ├── JournalList/
│   │   │   │   ├── JournalList.jsx
│   │   │   │   ├── JournalList.module.css
│   │   │   │   └── index.js
│   │   │   ├── EntryCard/
│   │   │   │   ├── EntryCard.jsx
│   │   │   │   ├── EntryCard.module.css
│   │   │   │   └── index.js
│   │   │   ├── MoodTracker/
│   │   │   │   ├── MoodTracker.jsx
│   │   │   │   ├── MoodTracker.module.css
│   │   │   │   └── index.js
│   │   │   ├── SymptomLogger/
│   │   │   │   ├── SymptomLogger.jsx
│   │   │   │   ├── SymptomLogger.module.css
│   │   │   │   └── index.js
│   │   │   └── SearchFilter/
│   │   │       ├── SearchFilter.jsx
│   │   │       ├── SearchFilter.module.css
│   │   │       └── index.js
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatInterface/
│   │   │   │   ├── ChatInterface.jsx
│   │   │   │   ├── ChatInterface.module.css
│   │   │   │   └── index.js
│   │   │   ├── MessageList/
│   │   │   │   ├── MessageList.jsx
│   │   │   │   ├── MessageList.module.css
│   │   │   │   └── index.js
│   │   │   ├── MessageInput/
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   ├── MessageInput.module.css
│   │   │   │   └── index.js
│   │   │   ├── ContactList/
│   │   │   │   ├── ContactList.jsx
│   │   │   │   ├── ContactList.module.css
│   │   │   │   └── index.js
│   │   │   └── EmojiPicker/
│   │   │       ├── EmojiPicker.jsx
│   │   │       ├── EmojiPicker.module.css
│   │   │       └── index.js
│   │   │
│   │   └── resources/
│   │       ├── ResourceLibrary/
│   │       │   ├── ResourceLibrary.jsx
│   │       │   ├── ResourceLibrary.module.css
│   │       │   └── index.js
│   │       ├── ArticleCard/
│   │       │   ├── ArticleCard.jsx
│   │       │   ├── ArticleCard.module.css
│   │       │   └── index.js
│   │       ├── EducationalContent/
│   │       │   ├── EducationalContent.jsx
│   │       │   ├── EducationalContent.module.css
│   │       │   └── index.js
│   │       └── ExpertAdvice/
│   │           ├── ExpertAdvice.jsx
│   │           ├── ExpertAdvice.module.css
│   │           └── index.js
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.module.css
│   │   │   └── index.js
│   │   ├── Calendar/
│   │   │   ├── Calendar.jsx
│   │   │   ├── Calendar.module.css
│   │   │   └── index.js
│   │   ├── Milestones/
│   │   │   ├── Milestones.jsx
│   │   │   ├── Milestones.module.css
│   │   │   └── index.js
│   │   ├── Journal/
│   │   │   ├── Journal.jsx
│   │   │   ├── Journal.module.css
│   │   │   └── index.js
│   │   ├── Chat/
│   │   │   ├── Chat.jsx
│   │   │   ├── Chat.module.css
│   │   │   └── index.js
│   │   ├── Profile/
│   │   │   ├── Profile.jsx
│   │   │   ├── Profile.module.css
│   │   │   └── index.js
│   │   └── NotFound/
│   │       ├── NotFound.jsx
│   │       ├── NotFound.module.css
│   │       └── index.js
│   │
│   ├── context/
│   │   ├── AppContext.js
│   │   ├── PregnancyContext.js
│   │   ├── CalendarContext.js
│   │   ├── MilestoneContext.js
│   │   ├── JournalContext.js
│   │   └── ChatContext.js
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── usePregnancyCalculations.js
│   │   ├── useCalendar.js
│   │   ├── useMilestones.js
│   │   ├── useJournal.js
│   │   ├── useChat.js
│   │   ├── useNotifications.js
│   │   └── useFileUpload.js
│   │
│   ├── utils/
│   │   ├── pregnancyCalculations.js
│   │   ├── dateHelpers.js
│   │   ├── milestoneHelpers.js
│   │   ├── journalHelpers.js
│   │   ├── chatHelpers.js
│   │   ├── fileHelpers.js
│   │   ├── constants.js
│   │   └── validators.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   ├── animations.css
│   │   ├── utilities.css
│   │   └── reset.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── pregnancy/
│   │   │   │   ├── week-1.svg
│   │   │   │   ├── week-2.svg
│   │   │   │   └── (40 week illustrations)
│   │   │   ├── milestones/
│   │   │   │   ├── first-kick.svg
│   │   │   │   ├── gender-reveal.svg
│   │   │   │   ├── baby-shower.svg
│   │   │   │   └── ultrasound.svg
│   │   │   ├── celebrations/
│   │   │   │   ├── confetti.svg
│   │   │   │   ├── heart.svg
│   │   │   │   └── star.svg
│   │   │   ├── icons/
│   │   │   │   ├── baby.svg
│   │   │   │   ├── calendar.svg
│   │   │   │   ├── journal.svg
│   │   │   │   └── chat.svg
│   │   │   └── placeholders/
│   │   │       ├── milestone-placeholder.jpg
│   │   │       └── user-avatar.svg
│   │   └── fonts/
│   │       └── (if custom fonts needed)
│   │
│   ├── App.jsx
│   ├── App.module.css
│   ├── main.jsx
│   └── index.css
│
├── .env.example
├── .env.local
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## 📦 Dependencies Matrix

### Production Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "lucide-react": "^0.263.1",
    "date-fns": "^2.29.3",
    "react-calendar": "^4.6.0",
    "framer-motion": "^10.16.4"
  }
}
```

### Development Dependencies
```json
{
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^5.0.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "prettier": "^3.0.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "jsdom": "^22.1.0"
  }
}
```

### Package Justification
- **React 18+**: Latest stable with improved performance
- **Vite**: Fast build tool optimized for modern development
- **React Router v6**: Modern routing with nested routes
- **Lucide React**: Beautiful, consistent icon library
- **date-fns**: Essential for pregnancy calculations and calendar
- **react-calendar**: Full-featured calendar component
- **Framer Motion**: Smooth animations for milestone celebrations

---

## 🎨 Complete Style Guide

### 🌈 Color System

#### Primary Motherhood Colors
```css
:root {
  /* Nurturing primary palette */
  --color-soft-pink: #F4A6CD;         /* Nurturing, feminine, comfort */
  --color-warm-peach: #FFB5A7;        /* Growth, warmth, support */
  --color-gentle-lavender: #C8A8E9;   /* Calm, peace, spiritual */
  --color-sage-green: #A8D8A8;        /* Nature, health, balance */
  --color-cream-white: #FFF8F0;       /* Purity, new beginnings */
  
  /* Supporting warm tones */
  --color-rose-gold: #E8B4B8;         /* Elegance, celebration */
  --color-soft-coral: #FFB3BA;        /* Joy, vitality */
  --color-mint-green: #B5E7A0;        /* Fresh, growth */
}
```

#### Neutral Colors
```css
:root {
  /* Gentle neutral palette */
  --color-white: #FFFFFF;
  --color-warm-white: #FEFCF8;
  --color-light-cream: #FAF7F2;
  --color-soft-gray: #F5F3F0;
  --color-medium-gray: #E8E6E3;
  --color-warm-gray: #D1CFC8;
  --color-text-light: #A8A6A1;
  --color-text-medium: #6B6862;
  --color-text-dark: #4A453F;
  --color-text-primary: #2D2A24;
  
  /* Semantic colors */
  --color-success: #7FB069;
  --color-warning: #F4A261;
  --color-error: #E76F51;
  --color-info: #457B9D;
}
```

#### Trimester Color Coding
```css
:root {
  /* Trimester-specific colors */
  --color-trimester-1: #FFE5E5;       /* Soft pink - new beginnings */
  --color-trimester-2: #FFF0E5;       /* Warm peach - growth */
  --color-trimester-3: #E5F5E5;       /* Gentle green - preparation */
  
  /* Progress bar gradients */
  --gradient-trimester-1: linear-gradient(90deg, #F4A6CD, #FFB5A7);
  --gradient-trimester-2: linear-gradient(90deg, #FFB5A7, #C8A8E9);
  --gradient-trimester-3: linear-gradient(90deg, #C8A8E9, #A8D8A8);
}
```

### 📝 Typography

#### Font Stack
```css
:root {
  /* Primary font - Warm and readable */
  --font-primary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  
  /* Secondary font - Clean for data */
  --font-secondary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                    'Roboto', sans-serif;
  
  /* Decorative font - For celebrations */
  --font-decorative: 'Dancing Script', cursive;
}
```

#### Type Scale
```css
:root {
  /* Font sizes */
  --text-xs: 0.75rem;     /* 12px - Small labels */
  --text-sm: 0.875rem;    /* 14px - Body small */
  --text-base: 1rem;      /* 16px - Body text */
  --text-lg: 1.125rem;    /* 18px - Large body */
  --text-xl: 1.25rem;     /* 20px - Small headings */
  --text-2xl: 1.5rem;     /* 24px - Card titles */
  --text-3xl: 1.875rem;   /* 30px - Section headers */
  --text-4xl: 2.25rem;    /* 36px - Page titles */
  --text-5xl: 3rem;       /* 48px - Hero titles */
  
  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 📐 Spacing & Layout

#### Spacing Scale
```css
:root {
  /* Spacing scale (8px base) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  
  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
}
```

#### Border Radius
```css
:root {
  /* Soft, nurturing border radius */
  --radius-sm: 0.5rem;    /* 8px */
  --radius-md: 0.75rem;   /* 12px */
  --radius-lg: 1rem;      /* 16px */
  --radius-xl: 1.5rem;    /* 24px */
  --radius-2xl: 2rem;     /* 32px */
  --radius-full: 9999px;  /* Full rounded */
}
```

### 🎭 Shadows & Effects

```css
:root {
  /* Gentle, nurturing shadows */
  --shadow-soft: 0 2px 8px rgba(244, 166, 205, 0.1);
  --shadow-medium: 0 4px 16px rgba(244, 166, 205, 0.15);
  --shadow-strong: 0 8px 32px rgba(244, 166, 205, 0.2);
  --shadow-celebration: 0 8px 32px rgba(255, 181, 167, 0.3);
  
  /* Standard shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 200ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
  --transition-bounce: 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### 🔘 Component Styles

#### Buttons
```css
.btn {
  /* Base button styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  line-height: var(--leading-tight);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  cursor: pointer;
  text-decoration: none;
}

.btn-primary {
  background: var(--gradient-trimester-2);
  color: var(--color-white);
  box-shadow: var(--shadow-medium);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-strong);
}

.btn-secondary {
  background-color: var(--color-white);
  color: var(--color-soft-pink);
  border-color: var(--color-soft-pink);
}

.btn-celebration {
  background: var(--gradient-trimester-1);
  color: var(--color-white);
  box-shadow: var(--shadow-celebration);
  animation: gentle-pulse 2s infinite;
}

.btn-milestone {
  background-color: var(--color-sage-green);
  color: var(--color-white);
  border-radius: var(--radius-full);
}
```

#### Cards
```css
.card {
  background-color: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-soft);
  padding: var(--space-6);
  transition: all var(--transition-normal);
  border: 1px solid var(--color-soft-gray);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
}

.card-milestone {
  background: linear-gradient(135deg, var(--color-white), var(--color-light-cream));
  border-left: 4px solid var(--color-soft-pink);
}

.card-journal {
  background-color: var(--color-warm-white);
  border: 2px solid var(--color-gentle-lavender);
}

.card-pregnancy-week {
  background: var(--gradient-trimester-1);
  color: var(--color-white);
  text-align: center;
}
```

#### Progress Bars
```css
.progress-bar {
  width: 100%;
  height: var(--space-6);
  background-color: var(--color-soft-gray);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: var(--gradient-trimester-2);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 📱 Responsive Breakpoints

```css
:root {
  /* Breakpoints optimized for pregnant users */
  --bp-xs: 480px;    /* Small phones */
  --bp-sm: 640px;    /* Large phones */
  --bp-md: 768px;    /* Tablets */
  --bp-lg: 1024px;   /* Small desktops */
  --bp-xl: 1280px;   /* Large desktops */
}

/* Mobile-first media queries */
@media (min-width: 480px) { /* xs */ }
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

### ♿ Accessibility Guidelines

```css
/* Enhanced focus states for pregnancy needs */
*:focus {
  outline: 3px solid var(--color-soft-pink);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Reduced motion for pregnancy sensitivity */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --color-soft-pink: #C2185B;
    --color-warm-peach: #F57C00;
    --color-sage-green: #388E3C;
  }
}

/* Large text support */
@media (prefers-reduced-data: reduce) {
  .img-decorative {
    display: none;
  }
}
```

### 🎨 Animation Library

```css
/* Gentle, nurturing animations */
@keyframes gentle-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes celebration-bounce {
  0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
  40%, 43% { transform: translateY(-15px); }
  70% { transform: translateY(-7px); }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heart-beat {
  0% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
  75% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Utility classes for animations */
.animate-gentle-pulse {
  animation: gentle-pulse 3s infinite;
}

.animate-celebration {
  animation: celebration-bounce 1s ease-in-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

.animate-heart-beat {
  animation: heart-beat 1.5s infinite;
}
```

### 🤱 Pregnancy-Specific Styling

```css
/* Trimester-specific components */
.trimester-1 {
  --primary-color: var(--color-soft-pink);
  --bg-color: var(--color-trimester-1);
  --gradient: var(--gradient-trimester-1);
}

.trimester-2 {
  --primary-color: var(--color-warm-peach);
  --bg-color: var(--color-trimester-2);
  --gradient: var(--gradient-trimester-2);
}

.trimester-3 {
  --primary-color: var(--color-sage-green);
  --bg-color: var(--color-trimester-3);
  --gradient: var(--gradient-trimester-3);
}

/* Milestone celebration styles */
.milestone-achieved {
  background: var(--gradient-trimester-1);
  color: var(--color-white);
  position: relative;
  overflow: hidden;
}

.milestone-achieved::before {
  content: '✨';
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  font-size: var(--text-lg);
  animation: celebration-bounce 2s infinite;
}
```

This comprehensive style guide creates a warm, nurturing, and supportive design system perfect for guiding women through their pregnancy journey while maintaining professional medical standards and accessibility compliance.